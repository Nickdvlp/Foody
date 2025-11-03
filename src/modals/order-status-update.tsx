"use client";

import { Loader2, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { getOrdersByRestaurant } from "@/modules/order/server/get-orders-by-restaurant";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { updateOrderStatus } from "@/modules/order/server/update-order-status";
import toast from "react-hot-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface OrderStatusUpdateProps {
  restaurantId: string;
}

interface Order {
  orderId: string;
  totalAmount: number;
  orderStatus:
    | "Placed"
    | "Confirmed"
    | "Preparing"
    | "Ready for Pickup"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  paymentMethod: string;
  paymentStatus: string | null;
  createdAt: Date | null;
  userName: string;
  userImage: string;
  addressFullName: string;
  addressPhone: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  foodName: string;
  foodImage: string | null;
  quantity: number;
  price: string;
}

const OrderStatusUpdate = ({ restaurantId }: OrderStatusUpdateProps) => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdersByRestaurant = async () => {
      if (!restaurantId) return;
      const data = await getOrdersByRestaurant({ restaurantId });
      setOrders(data);
      console.log(data);
    };
    fetchOrdersByRestaurant();
  }, [restaurantId]);

  const groupedOrders = orders?.reduce(
    (acc: Record<string, Order[]>, order) => {
      if (!acc[order.orderId]) acc[order.orderId] = [];
      acc[order.orderId].push(order);
      return acc;
    },
    {}
  );

  if (!orders)
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin text-orange-600" size={32} />
      </div>
    );

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["orderStatus"]
  ) => {
    setUpdating(orderId);
    try {
      console.log("Updating order", orderId, "to", newStatus);
      setOrders(
        (prev) =>
          prev?.map((order) =>
            order.orderId === orderId
              ? { ...order, orderStatus: newStatus }
              : order
          ) ?? null
      );

      const res = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, newStatus }),
      });

      if (!res.ok) toast.error("Failed to update status");
      toast.success("Order status updated.");
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-4xl mt-3">
      <div className="m-3 md:hidden">
        <SidebarTrigger>
          <Menu />
        </SidebarTrigger>
      </div>
      <div>
        <div className="text-center text-2xl font-semibold text-gray-800">
          Manage Orders
        </div>
        <div className="text-center text-gray-500">
          Update order statuses and notify users instantly.
        </div>
      </div>

      <div className="mt-6 space-y-5 max-h-[70vh] overflow-y-auto pr-2">
        {Object.entries(groupedOrders || {}).map(([orderId, items]) => {
          const order = items[0];
          return (
            <Card
              key={orderId}
              className="rounded-2xl shadow-md border border-gray-200 bg-white"
            >
              <CardContent className="p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{orderId.slice(0, 6).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on{" "}
                      {new Date(order.createdAt ?? "").toLocaleString()}
                    </p>
                  </div>

                  <Select
                    defaultValue={order.orderStatus}
                    onValueChange={(val) =>
                      handleStatusChange(orderId, val as Order["orderStatus"])
                    }
                    disabled={updating === orderId}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Placed",
                        "Confirmed",
                        "Preparing",
                        "Ready for Pickup",
                        "Out for Delivery",
                        "Delivered",
                        "Cancelled",
                      ].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Image
                    src={order.userImage}
                    alt={order.userName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{order.userName}</p>
                    <p className="text-sm text-gray-500">
                      {order.addressCity}, {order.addressState}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-3">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {item.foodImage && (
                          <Image
                            src={item.foodImage}
                            alt={item.foodName}
                            width={50}
                            height={50}
                            className="rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.foodName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{Number(item.price) * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t pt-3">
                  <p className="text-gray-600 text-sm">
                    Payment: {order.paymentMethod}{" "}
                    <span className="text-xs text-gray-400">
                      ({order.paymentStatus})
                    </span>
                  </p>
                  <p className="font-semibold text-lg text-gray-800">
                    Total: ₹{order.totalAmount}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusUpdate;
