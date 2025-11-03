import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addCartItemAsync } from "@/store/cart/cartSlice";
import { AppDispatch, RootState } from "@/store";
import { Loader2 } from "lucide-react";
import { useState } from "react";
interface Food {
  id: string;
  name: string;
  description: string;
  price: string;
  preparationTime: number;
  imageUrl: string | null;
  isAvailable: boolean;
  restaurantId: string;
  restaurantName: string | null;
}

const FoodCard = ({ food }: { food: Food }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const addItemToCart = async () => {
    try {
      setIsLoading(true);
      await dispatch(addCartItemAsync(food.id));

      toast.success("item added to cart");
    } catch (error) {
      toast.error("Failed to add item");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full sm:w-[300px] md:w-[340px] lg:w-[360px] border rounded-2xl shadow-lg border-gray-200 overflow-hidden bg-white hover:shadow-xl transition flex flex-col">
      {/* Image */}
      <div className="relative h-40 sm:h-48 w-full">
        <Image
          src={food.imageUrl || "/icon.png"}
          alt={food.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">{food.name}</h2>

          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-gray-600 line-clamp-2">
                {food.description.slice(0, 50)}...
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm text-white">{food.description}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-orange-600 font-bold text-sm sm:text-base">
            ₹{food.price}
          </span>
          <span className="text-xs text-gray-500">
            {food.preparationTime} min
          </span>
        </div>

        {food.restaurantName && (
          <p className="text-xs text-gray-400 mt-1">By {food.restaurantName}</p>
        )}

        <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
          <span
            className={`text-sm font-medium ${
              food.isAvailable ? "text-green-600" : "text-red-600"
            }`}
          >
            {food.isAvailable ? "Available" : "Unavailable"}
          </span>
          {isLoading ? (
            <Button
              disabled
              className="bg-orange-600 hover:bg-orange-500 text-sm px-3 py-1.5"
            >
              <Loader2 className="animate-spin" size={16} />
              Loading
            </Button>
          ) : (
            <Button
              className="bg-orange-600 hover:bg-orange-500 text-sm px-3 py-1.5"
              onClick={addItemToCart}
            >
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
