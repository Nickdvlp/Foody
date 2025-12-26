"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FetchFood } from "../server/fetch-food";
import FoodCard from "./food-card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  appendFoods,
  filteredFood,
  setLoading,
  setFoods,
} from "@/store/food/foodSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

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
  const dispatch = useDispatch<AppDispatch>();

  const foodItems = useSelector((state: RootState) => state.food.foods);
  const loading = useSelector((state: RootState) => state.food.loading);

  const [page, setPage] = useState(1);
  const [hasMoreFood, setHasMoreFood] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchInitialFood = async () => {
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
      dispatch(setLoading(false));
    };

    fetchInitialFood();
  }, [dispatch]);

  // -------------------------------
  // Apply filters
  // -------------------------------
  useEffect(() => {
    if (filters) {
      dispatch(filteredFood(filters));
      setPage(1);
      setHasMoreFood(true);
    }
  }, [filters, dispatch]);

  const loadMore = useCallback(async () => {
    if (!hasMoreFood || fetchingMore) return;

    setFetchingMore(true);

    const nextPage = page + 1;
    const moreFood = await FetchFood(nextPage);

    if (!Array.isArray(moreFood) || moreFood.length === 0) {
      setHasMoreFood(false);
      setFetchingMore(false);
      return;
    }

    const normalized = moreFood.map((item) => ({
      ...item,
      isVeg: item.isVeg ?? false,
      rating: Number(item.rating) || 0,
    }));

    dispatch(appendFoods(normalized));
    setPage(nextPage);
    setFetchingMore(false);
  }, [page, hasMoreFood, fetchingMore, dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = observerRef.current;

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loadMore]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 place-items-center mt-4 relative">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full sm:w-[300px] md:w-[340px] lg:w-[360px] h-80"
          />
        ))}

        <div className="absolute inset-0 flex items-start justify-center mt-10">
          <div className="flex items-center gap-2 bg-orange-200 p-4 rounded-full text-orange-600 font-semibold">
            <Loader2 className="animate-spin" />
            Serving food for you...
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2 place-items-center m-2">
        {foodItems.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>

      <div ref={observerRef} className="h-12 flex justify-center items-center">
        {fetchingMore && <Loader2 className="animate-spin text-orange-500" />}

        {!hasMoreFood && (
          <p className="text-sm text-gray-500">No more food 🍽️</p>
        )}
      </div>
    </div>
  );
};

export default FoodList;
