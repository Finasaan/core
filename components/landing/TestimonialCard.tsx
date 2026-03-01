import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

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
    <Card className="break-inside-avoid mb-6 rounded-2xl border-none bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.1)] transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-0 translate-x-4 -translate-y-4 text-[#159F63]/10 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
        <Quote size={80} strokeWidth={1} />
      </div>
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col gap-6">
          <p className="text-base sm:text-lg leading-relaxed text-zinc-700 font-medium">"{content}"</p>
          
          <div className="flex items-center gap-4 mt-2 pt-6 border-t border-zinc-100">
            <Avatar className="h-11 w-11 shrink-0 ring-2 ring-white shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-[#159F63] to-[#0A6C41] text-white font-semibold text-xs tracking-wider">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left flex flex-col">
              <h4 className="font-bold text-zinc-900 tracking-tight">{author}</h4>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{subtitle}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
