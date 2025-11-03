"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteItemProps {
  onDelete: () => void;
}

export function DeleteItem({ onDelete }: DeleteItemProps) {
  return (
    <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Delete Selected Item</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this item? If yes, click on the{" "}
          <strong>Yes</strong> button; otherwise, cancel.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <div className="flex items-center justify-center gap-3">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button className="bg-red-500 hover:bg-red-600" onClick={onDelete}>
              Yes
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
