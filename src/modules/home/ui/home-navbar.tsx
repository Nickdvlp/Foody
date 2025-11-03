"use client";

import { Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import SearchBar from "./search-bar";

import AuthButton from "@/modules/auth/ui/auth-button";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getCartItems } from "@/modules/cart/server/get-cart-items";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "@/store/cart/cartSlice";

interface Cart {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
const HomeNavbar = () => {
  const [IsMobileNavbarOpen, setIsMobileNavbarOpen] = useState(false);
  const cartItems = useSelector((state: any) => state.cart.items);
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !isLoaded) return;
    const fetchCartItems = async () => {
      const data = await getCartItems({ userId: user.id });
      dispatch(
        setCartItems(
          data.map((item) => ({
            ...item,
            createdAt: item.createdAt ? item.createdAt.toISOString() : "",
            updatedAt: item.updatedAt ? item.updatedAt.toISOString() : "",
          }))
        )
      );
    };
    fetchCartItems();
  }, [isLoaded, user]);

  const totalQuantity = cartItems?.reduce(
    (acc: number, curr: Cart) => acc + curr.quantity,
    0
  );

  return (
    <div className="fixed left-0 right-0 top-0 border border-gray-200 border-t-0 rounded-2xl rounded-t-none z-50 flex items-center justify-between gap-4 px-4 py-3 mx-4 shadow-xl h-[4rem] bg-white">
      <div
        className="flex items-center justify-center gap-2 md:gap-3"
        onClick={() => redirect("/")}
      >
        <Image
          src={"/icon.png"}
          alt="logo"
          className="w-8 md:w-10"
          width={40}
          height={40}
        />
        <p className="text-orange-700 font-bold hidden md:block">Foody</p>
      </div>

      {/* Mobile Menu */}
      <div className="flex items-center justify-center gap-5  *:text-orange-700 *:font-semibold md:hidden">
        <div onClick={() => setIsMobileNavbarOpen(true)} className="mr-4">
          {IsMobileNavbarOpen ? <SearchBar isMobile={true} /> : <Search />}
        </div>
        <p className="text-xs flex gap-7 items-center justify-center">
          <div className="relative">
            <ShoppingBag
              className="mb-1 cursor-pointer"
              onClick={() => redirect("/cart")}
            />
            <div className="absolute top-0 -right-1 bg-black text-white text-[9px] rounded-full w-4 h-4 flex justify-center items-center">
              {totalQuantity}
            </div>
          </div>
          <AuthButton />
        </p>
      </div>

      {/* Desktop Menu */}
      <SearchBar isMobile={false} />
      <div className="hidden md:flex items-center justify-center gap-7 *:text-orange-700">
        <div className="relative" onClick={() => redirect("/cart")}>
          <ShoppingBag className="mb-1 cursor-pointer" />
          <div className="absolute top-0 -right-1 bg-black text-white text-[9px] rounded-full w-4 h-4 flex justify-center items-center">
            {totalQuantity}
          </div>
        </div>
        <AuthButton />
      </div>
    </div>
  );
};

export default HomeNavbar;
