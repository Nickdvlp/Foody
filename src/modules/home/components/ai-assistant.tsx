import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AIChatDialog from "@/modals/ai-chat-dialog";
import { BotMessageSquare } from "lucide-react";
import React from "react";

const AIAssistant = () => {
  return (
    <div className="bottom-10 right-6 fixed bg-orange-500 text-white inline-flex p-4 rounded-full md:right-10 shadow-[0_0_30px_rgba(0,0,0,0.2)] shadow-orange-600">
      <Dialog modal={false}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger>
              <BotMessageSquare />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Choose Your Food With AI</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent>
          <AIChatDialog />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIAssistant;
