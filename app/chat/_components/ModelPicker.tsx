"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CpuIcon, ChevronDownIcon } from "lucide-react";

export interface Model {
  id: string;
  name: string;
  description: string;
  isPro: boolean;
  supportsToolCalling: boolean;
}

interface ModelPickerProps {
  models: Model[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ModelPicker({ models, selectedId, onSelect }: ModelPickerProps) {
  const selected = models.find((m) => m.id === selectedId) ?? models[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="model-picker__trigger">
          <CpuIcon size={10} />
          {selected?.name ?? "Model"}
          <ChevronDownIcon size={9} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        className="model-picker__dropdown"
      >
        {models.map((m) => (
          <DropdownMenuItem
            key={m.id}
            className={`model-picker__item${m.id === selectedId ? " active" : ""}`}
            onClick={() => onSelect(m.id)}
          >
            <span className="model-picker__item-name">
              {m.name}
              {m.isPro && (
                <Badge variant="secondary" className="model-picker__badge ml-2">
                  Pro
                </Badge>
              )}
            </span>
            <span className="model-picker__item-desc">{m.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
