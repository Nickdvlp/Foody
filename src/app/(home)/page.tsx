"use client";
import FullScreenLoader from "@/components/ui/full-screen-loader";
import AIAssistant from "@/modules/home/components/ai-assistant";
import FilterList from "@/modules/home/components/filter-list";
import FoodList from "@/modules/home/components/food-list";
import TopRatedButton from "@/modules/home/components/top-rated-button";
import HomeCarousel from "@/modules/home/ui/home-carousel";
import { RootState } from "@/store";
import { setLoading } from "@/store/food/foodSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface Filter {
  selectedCategories: string[];
  priceRange: number[];
  isVeg: boolean;
  minRating: number;
}
export default function Home() {
  const [filters, setFilters] = useState<Filter | null>({
    selectedCategories: [""],
    priceRange: [100, 1000],
    isVeg: false,
    minRating: 0,
  });

  return (
    <div className="relative">
      <div>
        <HomeCarousel />
        <div className="flex items-center">
          <FilterList setFilters={setFilters} />
          <TopRatedButton />
        </div>
        <FoodList filters={filters} />
        <AIAssistant />
      </div>
    </div>
  );
}
