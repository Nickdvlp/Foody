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
import { deletePartner } from "@/modules/partner/server/delete-partner";
import { Partner } from "@/modules/partner/ui/view/partner-view";
import { deleteRestaurant } from "@/modules/restaurant/server/delete-restaurant";
import { Restaurant } from "@/modules/restaurant/views/restaurant-view";
import { useRouter } from "next/navigation";

interface DeletePartnerProps {
  restaurant: Restaurant | null;
  onSuccess: () => void;
}

export function DeleteRestaurant({
  restaurant,
  onSuccess,
}: DeletePartnerProps) {
  const router = useRouter();
  const onDelete = async () => {
    await deleteRestaurant({ restaurant: restaurant?.id });
    onSuccess();
    router.push("/");
  };
  return (
    <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Delete Partner</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete your account? If yes, click on the{" "}
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
