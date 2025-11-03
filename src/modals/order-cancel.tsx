"use client";

import { Order } from "@/app/(order)/orders/page";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cancelOrder } from "@/modules/order/server/cancelOrder";
import { getOrders } from "@/modules/order/server/get-orders";
import React from "react";

interface OrderCancelProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  orders: Order[] | null;
  setOrders: (value: []) => void;
  orderId: string;
}

const OrderCancel = ({
  open,
  onOpenChange,
  orders,
  setOrders,
  orderId,
}: OrderCancelProps) => {
  const handleCancelOrder = async (id: string) => {
    await cancelOrder(id);
    const updatedOrdersData = await getOrders();
    setOrders(updatedOrdersData);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <h1 className="text-xl font-semibold">Confirm Order Cancellation </h1>
          <p className="text-sm text-muted-foreground">
            Can you please tell why do you want to cancel order?
          </p>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Ordered by mistake</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Found a better price elsewhere</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Delivery time is too long</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Changed my mind</Label>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            please provide genuine reason for enhance order experience
          </p>
        </div>
        <DialogClose>
          <Button onClick={() => handleCancelOrder(orderId)}>Cancel</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default OrderCancel;
