"use client";

import { useRealtime } from "@upstash/realtime/client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrders } from "@/modules/order/server/get-orders";
import { Button } from "@/components/ui/button";

import OrderCancel from "@/modals/order-cancel";
import { Loader2 } from "lucide-react";
import { RealtimeEvents } from "@/lib/realtime";
import { redirect } from "next/navigation";
import { RatingDialog } from "@/modals/rating-modal";
import { submitRatingsAndReviews } from "@/modules/restaurant/server/ratings-reviews";
import toast from "react-hot-toast";

interface OrderItem {
  id: string;
  itemId: string;
  name: string;
  price: string;
  quantity: number;
  image: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string | null;
  createdAt: string;
}

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOrderCancel, setIsOrderCancel] = useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState("Placed");
  const [openRatingCard, setOpenRatingCard] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useRealtime<RealtimeEvents>({
    event: "order.status",
    onData(data) {
      setOrderStatus(data);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500 flex items-center justify-center gap-2">
          <span>
            <Loader2 className="animate-spin" />
          </span>
          Loading your orders...
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">No orders found.</p>
      </div>
    );
  }

  const handleSubmitRating = async (rating: number, review: string) => {
    const res = await submitRatingsAndReviews({
      rating,
      review,
      restaurantId: selectedOrder.restaurantId,
      orderId: selectedOrder.id,
    });

    if (res.success === false) {
      toast.error("You already rated this order or something else.");
    }
    if (res.success === true) {
      toast.success("We successfully collected your feedback.Thank You!");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 py-16 px-6 md:px-12 lg:px-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🧾 My Orders
      </h1>

      <div className="max-w-6xl mx-auto space-y-8">
        {[...orders].reverse().map((order) => (
          <Card
            key={order.id}
            className="bg-white/90 backdrop-blur-md shadow-lg border border-orange-200 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-102 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              redirect(`track-order/${order.id}`);
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex justify-between items-center">
                Order ID: {order.id.slice(0, 8)}...
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.paymentStatus === "Success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </CardTitle>
              <div className="bg-orange-600 w-fit px-5 py-2 rounded-2xl text-white font-semibold">
                {order.orderStatus}
              </div>
            </CardHeader>

            <CardContent className="space-y-4 relative">
              <p className="text-gray-600 text-sm">
                Payment Method:{" "}
                <span className="font-medium">{order.paymentMethod}</span>
              </p>
              <p className="text-gray-600 text-sm">
                Total Amount:{" "}
                <span className="font-semibold">₹{order.totalAmount}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Ordered At: {new Date(order.createdAt).toLocaleString()}
              </p>

              <Separator className="my-2" />

              {order.orderStatus === "Delivered" && (
                <div
                  className="border border-yellow-400 w-fit p-2 rounded-2xl text-yellow-700 px-4 bg-yellow-200 hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrder(order);
                    setOpenRatingCard(true);
                  }}
                >
                  Rate Now
                </div>
              )}

              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <img
                          src={item.food.imageUrl}
                          alt={item.food.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex flex-col">
                          <p className="font-medium text-gray-800">
                            {item.food.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: ₹{item.food.price}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold mt-2 text-gray-800">
                        Total: ₹{Number(item.price) * item.quantity}
                      </p>
                      <OrderCancel
                        open={isOrderCancel}
                        onOpenChange={setIsOrderCancel}
                        orders={orders}
                        setOrders={setOrders}
                        orderId={order.id}
                      />
                    </div>
                    <Button
                      onClick={() => setIsOrderCancel(true)}
                      className=" bg-red-500 hover:bg-red-700"
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <RatingDialog
        open={openRatingCard}
        onClose={() => setOpenRatingCard(false)}
        onSubmit={handleSubmitRating}
        restaurantName={selectedOrder?.restaurantName}
      />
    </div>
  );
};

export default OrderPage;
