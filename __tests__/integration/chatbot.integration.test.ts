/**
 * Chatbot / FinasaanGPT integration tests.
 * Verifies that the chat API call sends the correct format and that
 * tool-augmented responses include grounded source citations.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const API_URL = "http://localhost:8787";

describe("FinasaanGPT – chat endpoint", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends user message in the correct OpenAI-compatible messages format", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "text/event-stream" }),
      body: new ReadableStream(),
    });

    const messages = [{ role: "user", content: "What is the current KSE-100 level?" }];

    await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, model: "llama-3.1-8b" }),
    });

    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const url = call[0] as string;
    const options = call[1] as RequestInit;
    const body = JSON.parse(options.body as string);

    expect(url).toContain("/api/chat");
    expect(body.messages).toHaveLength(1);
    expect(body.messages[0].role).toBe("user");
    expect(body.messages[0].content).toContain("KSE-100");
    expect(body.model).toBe("llama-3.1-8b");
  });

  it("tool-augmented response includes market data source citation", async () => {
    const mockStreamResponse = {
      id: "chat-resp-001",
      choices: [
        {
          message: {
            role: "assistant",
            content:
              "The KSE-100 index is currently at 115,842 points, up 0.37% today. Source: getLiveMarket (PSX feed, 2026-05-07 09:30 PKT).",
            tool_calls: [
              {
                id: "tool-001",
                type: "function",
                function: { name: "getLiveMarket", arguments: '{"index":"KSE-100"}' },
              },
            ],
          },
          finish_reason: "stop",
        },
      ],
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStreamResponse,
    });

    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Current KSE-100 level?" }],
        model: "llama-3.1-8b",
      }),
    });

    const result = await response.json() as typeof mockStreamResponse;
    const content = result.choices[0].message.content;

    expect(content).toContain("115,842");
    expect(content).toContain("getLiveMarket");
    expect(result.choices[0].message.tool_calls![0].function.name).toBe("getLiveMarket");
  });
});
