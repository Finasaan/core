import Image from "next/image";
import BrowserFrame from "./_BrowserFrame";

const HeroDashboardMockup = () => {
  return (
    <BrowserFrame
      url="app.finasaan.com"
      contentClassName="aspect-[16/9] bg-zinc-50"
    >
      <Image
        src="/landing/dashboard-preview.png"
        alt="Finasaan dashboard preview"
        fill
        priority
        sizes="(min-width: 1280px) 1100px, (min-width: 768px) 90vw, 100vw"
        className="object-cover object-top"
      />
    </BrowserFrame>
  );
};

export default HeroDashboardMockup;
