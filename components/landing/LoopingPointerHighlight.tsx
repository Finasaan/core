"use client";

import { useEffect, useState } from "react";
import {
  PointerHighlight,
} from "@/components/ui/pointer-highlight";

type Props = React.ComponentProps<typeof PointerHighlight> & {
  intervalMs?: number;
};

const LoopingPointerHighlight = ({ intervalMs = 5000, ...props }: Props) => {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return <PointerHighlight key={cycle} {...props} />;
};

export default LoopingPointerHighlight;
