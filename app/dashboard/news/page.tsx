import { NewsFeed } from "@/components/news";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Economic News | Finasaan",
  description: "Daily Pakistan economic news and business insights analyzed by AI.",
};

export default function NewsPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <NewsFeed />
    </div>
  );
}
