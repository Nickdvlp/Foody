"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AppDispatch, RootState } from "@/store";
import {
  clearCart,
  removeCartItemAsync,
  updateCartItemAsync,
} from "@/store/cart/cartSlice";
import { getEntireCartItems } from "@/modules/cart/server/get-entire-cart-items";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export interface EntireCartItems {
  id: string;
  quantity: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  itemId: string | null;
  name: string | null;
  price: string | null;
  image: string | null;
  restaurantId: string | null;
}

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
    EntireCartItems[] | null
  >(null);

  useEffect(() => {
    const fetchCartItemsDetails = async () => {
      const EntireCartItems = await getEntireCartItems();
      setCartItemsWithDetails(EntireCartItems);
    };
    fetchCartItemsDetails();
  }, [dispatch]);

  const handleIncrease = async (itemId: string) => {
    const item = cartItems.find((i) => i.itemId === itemId);
    if (item) {
      dispatch(updateCartItemAsync({ itemId, quantity: item.quantity + 1 }));
      const updatedDetails = await getEntireCartItems();
      setCartItemsWithDetails(updatedDetails);
    }
  };

  const handleDecrease = async (itemId: string) => {
    const item = cartItems.find((i) => i.itemId === itemId);
    if (item && item.quantity > 1) {
      dispatch(updateCartItemAsync({ itemId, quantity: item.quantity - 1 }));
    }
    const updatedDetails = await getEntireCartItems();
    setCartItemsWithDetails(updatedDetails);
  };

  const handleRemove = async (itemId: string) => {
    dispatch(removeCartItemAsync(itemId));
    const updatedDetails = await getEntireCartItems();
    setCartItemsWithDetails(updatedDetails);
  };

  const total = cartItemsWithDetails?.reduce((sum, item) => {
    const price = parseFloat(item.price || "0");
    return sum + price * item.quantity;
  }, 0);

  const restaurantId = cartItemsWithDetails?.map((item) => item.restaurantId);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        {cartItemsWithDetails && cartItemsWithDetails.length > 0 && (
          <Button
            onClick={() => redirect(`/checkout/${restaurantId}`)}
            className="bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold px-8 py-3 rounded-xl transition-transform duration-300 hover:scale-105 hover:from-red-500 hover:to-orange-400"
          >
            Checkout 🛒
          </Button>
        )}
      </div>

      {!cartItemsWithDetails ? (
        <div className="gap-3 flex flex-col items-center justify-center">
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
        </div>
      ) : cartItemsWithDetails.length === 0 ? (
        <p className="text-orange-500 flex items-center justify-center bg-orange-200 rounded-xl w-fit mx-auto p-4 font-semibold text-2xl">
          Your cart is empty
        </p>
      ) : (
        <div className="space-y-6">
          {cartItemsWithDetails.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white shadow-md rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name || "Food Item"}
                  width={70}
                  height={70}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h2 className="font-semibold text-lg">
                    {item.name || "Unnamed Item"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    ₹{item.price || 0} × {item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => item.itemId && handleDecrease(item.itemId)}
                >
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => item.itemId && handleIncrease(item.itemId)}
                >
                  +
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => item.itemId && handleRemove(item.itemId)}
                  disabled={!item.itemId}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <h2 className="font-bold text-lg">Total</h2>
            <p className="text-lg font-semibold">₹{total?.toFixed(2)}</p>
          </div>

          <Button variant="secondary" onClick={() => dispatch(clearCart())}>
            Clear Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
