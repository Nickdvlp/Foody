"use client";

declare global {
  interface Window {
    Razorpay: unknown;
  }
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AddAddress } from "@/modals/add-address";
import { getEntireCartItems } from "@/modules/cart/server/get-entire-cart-items";
import { getAllAddresses } from "@/modules/checkout/server/get-all-addresses";
import { setDefaultAddress } from "@/modules/checkout/server/set-default-address";
import { createOrder } from "@/modules/order/server/create-order";
import { AppDispatch } from "@/store";
import { clearCartItemAsync } from "@/store/cart/cartSlice";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export interface CartItem {
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

interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface CheckoutPageProps {
  restaurantId: string;
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function CheckoutPage({ restaurantId }: CheckoutPageProps) {
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
    CartItem[] | null
  >(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | null>(
    null
  );
  const [updateAddressList, setUpdateAddressList] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [confirmOrderDialog, setConfirmOrderDialog] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch cart items
  useEffect(() => {
    const fetchCartItemsDetails = async () => {
      const EntireCartItems = await getEntireCartItems();
      setCartItemsWithDetails(EntireCartItems);
    };
    fetchCartItemsDetails();
  }, []);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      const AddressesData = await getAllAddresses();
      setAddresses(AddressesData);
    };
    fetchAddresses();
  }, [updateAddressList]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("Razorpay" in window)) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleDefaultAddress = async (addressId: string) => {
    await setDefaultAddress(addressId);
    const updatedAddress = await getAllAddresses();
    setAddresses(updatedAddress);
  };

  const totalAmount = cartItemsWithDetails?.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (paymentMethod === "cod") {
      await createOrder({
        addressId: selectedAddressId,
        paymentMethod: "COD",
        items: cartItemsWithDetails,
        totalAmount,
        restaurantId,
      });
      setConfirmOrderDialog(true);

      dispatch(clearCartItemAsync());
      toast.success("Order placed with Cash on Delivery!");
    } else if (paymentMethod === "online") {
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        body: JSON.stringify({ amount: totalAmount }),
      });
      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "foody",
        description: "this is payment from razorpay.",
        order_id: data.id,
        handler: async function (response: RazorpaySuccessResponse) {
          console.log("Razorpay response", response);

          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            await createOrder({
              addressId: selectedAddressId,
              paymentMethod: "Online",
              items: cartItemsWithDetails,
              totalAmount,
              restaurantId,
            });
          }

          dispatch(clearCartItemAsync());
          toast.success("Payment successful and order placed");
          redirect("/");
        },
        prefill: {
          name: "User name",
          email: "email.com",
        },
        theme: { color: "#f97316" },
      };

      // @ts-expect-error Razorpay is injected at runtime
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      toast.success("Proceeding to Razorpay payment!");
    }
  };

  return cartItemsWithDetails?.length === 0 ? (
    <div className="flex items-center justify-center text-center text-orange-600 bg-orange-100 border border-orange-300 rounded-xl px-6 py-4 font-semibold text-lg">
      No items for checkout. Please choose any item to place your order.
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1.7fr_1fr] gap-10">
        {/* LEFT SECTION */}
        <div className="space-y-10">
          {/* Delivery Card */}
          <Card className="backdrop-blur-md bg-white/80 shadow-lg border border-orange-100 rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                🚚 Delivery Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {!addresses ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  <Skeleton className="w-full h-20" />
                  <Skeleton className="w-full h-20" />
                </div>
              ) : addresses && addresses.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-xl border cursor-pointer flex justify-between items-start gap-4 transition-all
                        ${
                          selectedAddressId === address.id
                            ? "border-orange-600 bg-orange-50"
                            : "border-gray-200 hover:border-orange-400"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedAddressId === address.id}
                          onCheckedChange={() => {
                            handleSelectAddress(address.id);
                            handleDefaultAddress(address.id);
                          }}
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-gray-800 font-medium">
                            {address.fullName}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {address.phone}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {address.street}, {address.city}, {address.state} -{" "}
                            {address.postalCode}
                          </p>
                        </div>
                      </div>
                      {address.isDefault && (
                        <span className="text-orange-600 font-semibold text-sm">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="self-start mt-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-6 py-2"
                  >
                    Add / Change Address
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-3">
                    You have not added an address yet
                  </p>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-8 py-2"
                  >
                    Add Address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="backdrop-blur-md bg-white/80 shadow-lg border border-orange-100 rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                💳 Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                    ${
                      paymentMethod === "cod"
                        ? "border-orange-600 bg-orange-50"
                        : "border-gray-200 hover:border-orange-400"
                    }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <Checkbox checked={paymentMethod === "cod"} />
                  <span className="text-gray-700 font-medium">
                    Cash on Delivery
                  </span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                    ${
                      paymentMethod === "online"
                        ? "border-orange-600 bg-orange-50"
                        : "border-gray-200 hover:border-orange-400"
                    }`}
                  onClick={() => setPaymentMethod("online")}
                >
                  <Checkbox checked={paymentMethod === "online"} />
                  <span className="text-gray-700 font-medium">
                    Online Payment
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SECTION */}
        <div className="md:sticky md:top-24 space-y-8">
          <Card className="backdrop-blur-md bg-white/90 shadow-xl border border-orange-100 rounded-2xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                🧾 Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cartItemsWithDetails === null ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="w-full h-10 rounded-lg" />
                  <Skeleton className="w-full h-10 rounded-lg" />
                  <Skeleton className="w-full h-10 rounded-lg" />
                </div>
              ) : (
                <div className="space-y-5">
                  {cartItemsWithDetails.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-none"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{Number(item.price) * item.quantity}
                      </p>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
                    <p>Total:</p>
                    <p>₹{totalAmount}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            className="w-full py-6 text-lg font-semibold rounded-2xl bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            onClick={handlePlaceOrder}
          >
            🛍️ Place Order
          </Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AddAddress
            closeDialog={() => setDialogOpen(false)}
            setUpdateAddressList={setUpdateAddressList}
          />
        </Dialog>
      </div>

      {confirmOrderDialog && (
        <Dialog open={confirmOrderDialog} onOpenChange={setConfirmOrderDialog}>
          <DialogContent className="bg-green-500 ring-4 ring-green-500 ring-offset-2">
            <DialogHeader>
              <DialogTitle className="font-bold text-white text-2xl">
                Order Confirmation
              </DialogTitle>
            </DialogHeader>
            <h1 className="text-center font-semibold text-xl text-white">
              Your Order Successfully placed.
            </h1>

            <DialogTrigger>
              <Button
                onClick={() => redirect("/orders")}
                className="bg-orange-600"
              >
                OK
              </Button>
            </DialogTrigger>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
