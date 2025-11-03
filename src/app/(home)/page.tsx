"use client";
import FilterList from "@/modules/home/components/filter-list";
import FoodList from "@/modules/home/components/food-list";
import HomeCarousel from "@/modules/home/ui/home-carousel";
import { useState } from "react";

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
    <div>
      <HomeCarousel />
      <FilterList setFilters={setFilters} />
      <FoodList filters={filters} />
    </div>
  );
}
