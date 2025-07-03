"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DatePicker from "./date-picker";

import { useIsMobile } from "@/hooks/use-mobile";
import { FaArrowRightFromBracket, FaPlus } from "react-icons/fa6";


export function ActionButtons() {
  const isMobile = useIsMobile();

  return (
    <div className="flex gap-3">
      <DatePicker />
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="aspect-square max-lg:p-0">
              <FaArrowRightFromBracket 
                className="lg:-ms-1 opacity-40 size-5"
                size={20}
                aria-hidden="true"
              />
              <span className="max-lg:sr-only">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="lg:hidden" hidden={isMobile}>
            Export
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="aspect-square max-lg:p-0">
              <FaPlus 
                className="lg:-ms-1 opacity-40 size-5"
                size={20}
                aria-hidden="true"
              />
              <span className="max-lg:sr-only">Add Chart</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="lg:hidden" hidden={isMobile}>
            Add Chart
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
