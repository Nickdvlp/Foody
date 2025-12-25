"use client";

import { useEffect, useState } from "react";
import { FetchFood } from "../server/fetch-food";
import FoodCard from "./food-card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { appendFoods, filteredFood, setLoading } from "@/store/food/foodSlice";
import { setFoods } from "@/store/food/foodSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Food {
  id: string;
  name: string;
  description: string;
  price: string;
  preparationTime: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isVeg: boolean;
  rating: number;
  category: string;
  restaurantId: string;
  restaurantName: string | null;
}

interface FoodListProps {
  filters: {
    selectedCategories: string[];
    priceRange: number[];
    isVeg: boolean;
    minRating: number;
  } | null;
}

const FoodList = ({ filters }: FoodListProps) => {
  const [page, setPage] = useState<number>(1);
  const [hasMoreFood, setHasMoreFood] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const foodItems = useSelector((state: RootState) => state.food.foods);
  const loading = useSelector((state: RootState) => state.food.loading);

  useEffect(() => {
    const fetchfood = async () => {
      dispatch(setLoading(true));
      const food = await FetchFood(1);
      const normalized = Array.isArray(food)
        ? food.map((item) => ({
            ...item,
            isVeg: item.isVeg ?? false,
            rating: Number(item.rating) || 0,
          }))
        : [];
      dispatch(setFoods(normalized));
    };

    fetchfood();
  }, [dispatch]);

  useEffect(() => {
    if (filters) {
      dispatch(filteredFood(filters));
    }
  }, [filters, dispatch]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 place-items-center  mt-4 relative">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full sm:w-[300px] md:w-[340px] lg:w-[360px] h-80"
          />
        ))}
        <div className="absolute inset-0 flex items-start justify-center mt-10 text-xl font-semibold">
          <div className="flex items-center justify-center gap-2 bg-orange-200 p-4 rounded-full text-orange-600">
            <Loader2 className="animate-spin" />
            Serving food for you...
          </div>
        </div>
      </div>
    );
  }
  const LoadMore = async () => {
    const nextPage = page + 1;
    const MoreFoodItems = await FetchFood(nextPage);
    if (!MoreFoodItems || !Array.isArray(MoreFoodItems)) {
      setHasMoreFood(false);
      return;
    }

    const normalized = MoreFoodItems.map((item) => ({
      ...item,
      isVeg: item.isVeg ?? false,
      rating: Number(item.rating) || 0,
    }));
    dispatch(appendFoods(normalized));
    setPage(page + 1);
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2 place-items-center m-2">
        {foodItems &&
          foodItems.map((food) => <FoodCard key={food.id} food={food} />)}
      </div>
      <div className="flex items-center justify-center mb-3">
        <Button onClick={LoadMore} disabled={!hasMoreFood}>
          {hasMoreFood ? "Load More" : "No more food 🍽️"}
        </Button>
      </div>
    </div>
  );
};

export default FoodList;
