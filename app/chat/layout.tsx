import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant | Finasaan",
  description: "Chat with our AI assistant about financial documents",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
