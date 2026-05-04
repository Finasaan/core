import Image from "next/image";
import BrowserFrame from "./_BrowserFrame";

const AIChatMockup = () => {
  return (
    <BrowserFrame
      url="app.finasaan.com/chat"
      contentClassName="aspect-[1922/928] bg-zinc-50"
    >
      <Image
        src="/landing/chat-preview.png"
        alt="FinasaanGPT chat preview"
        fill
        sizes="(min-width: 1280px) 1100px, (min-width: 768px) 90vw, 100vw"
        className="object-cover object-top"
      />
    </BrowserFrame>
  );
};

export default AIChatMockup;
