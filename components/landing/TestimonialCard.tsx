import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type TestimonialCardProps = {
  content: string;
  author: string;
  subtitle: string;
};

const TestimonialCard = ({ content, author, subtitle }: TestimonialCardProps) => {
  const initials = author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="break-inside-avoid mb-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Author row */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarFallback className="bg-[#159F63]/15 text-[#159F63] font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 leading-tight">{author}</h4>
              <p className="text-sm text-gray-500 leading-tight">{subtitle}</p>
            </div>
          </div>

          {/* Quote */}
          <p className="text-base leading-relaxed text-gray-600">{content}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
