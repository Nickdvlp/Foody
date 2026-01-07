"use client";

import AIAssistant from "@/modules/home/components/ai-assistant";
import FilterList from "@/modules/home/components/filter-list";
import FoodList from "@/modules/home/components/food-list";
import TopRatedButton from "@/modules/home/components/top-rated-button";
import HomeCarousel from "@/modules/home/ui/home-carousel";

import { useState } from "react";
import StorySection from "../../modules/story/components/story-section";

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
        <div className="h-6 flex items-center justify-center bg-orange-400 text-white font-semibold">
          See the offers and deals on restaurant's stories 🍟
        </div>
        <StorySection />
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
