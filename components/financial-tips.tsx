import { getCloudflareContext } from "@opennextjs/cloudflare";

interface FinancialTip {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
}

interface ApiResponse {
  success: boolean;
  data: FinancialTip[];
  timestamp: string;
}

// Server component that runs in the Cloudflare Worker context
export default async function FinancialTips() {
  let tips: FinancialTip[] = [];
  console.log("Fetching financial tips...");

  try {
    // Access env from global context in Cloudflare Worker using async mode
    const context = await getCloudflareContext({ async: true });
    let response = await context.env.SPINE.fetch(
      "https://spine/api/financial-tips"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    console.log("Response data:", result);

    if (result.success && result.data) {
      tips = result.data;
      console.log(`Successfully fetched ${tips.length} financial tips`);
    } else {
      console.warn("API response indicates failure:", result);
    }
  } catch (error) {
    console.error("Failed to fetch financial tips:", error);
    // tips remains empty array on error
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Financial Tips</h2>

      {tips.length === 0 ? (
        <p className="text-gray-600">
          Unable to load financial tips at this time.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {tip.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    tip.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : tip.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {tip.priority}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{tip.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 capitalize">
                  {tip.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
