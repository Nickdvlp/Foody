"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getCategories } from "../server/get-categories";
import { Filter } from "@/app/(home)/page";

interface Category {
  categories: string;
}
interface FilterListProps {
  setFilters: (Filter: Filter | null) => void;
}
const FilterList = ({ setFilters }: FilterListProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isVeg, setIsVeg] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();

      const unique = Array.from(
        new Set(data.map((item: Category) => item.categories))
      ).map((cat) => ({ categories: cat }));
      setCategories(unique);
    };
    fetchCategories();
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const applyFilters = () => {
    setFilters({
      selectedCategories,
      priceRange,
      isVeg,
      minRating,
    });
  };

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 py-2 px-6 rounded-xl border border-orange-200 text-orange-600 font-medium bg-orange-50/40 hover:bg-orange-100 transition-all shadow-sm hover:shadow-md mx-5"
        >
          <SlidersHorizontal size={20} />
          Filters
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl border border-orange-100 shadow-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Filter Restaurants
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-3">
          {/* Categories */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories?.map((cat) => (
                <button
                  key={cat.categories}
                  onClick={() => toggleCategory(cat.categories)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    selectedCategories.includes(cat.categories)
                      ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                      : "border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-300"
                  }`}
                >
                  {cat.categories}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Price Range (₹)</h3>
            <Slider
              value={priceRange}
              onValueChange={(val) => setPriceRange(val as [number, number])}
              min={0}
              max={2000}
              step={50}
              className="[&>[data-orientation=horizontal]>div]:bg-orange-600"
            />
            <div className="text-sm text-gray-500 mt-1">
              ₹{priceRange[0]} – ₹{priceRange[1]}
            </div>
          </div>

          {/* Veg / Non-Veg */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isVeg}
              onCheckedChange={() => setIsVeg(!isVeg)}
              className="border-orange-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
            />
            <span className="text-gray-700 text-sm">Show only Veg items</span>
          </div>

          {/* Ratings */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Minimum Rating</h3>
            <Slider
              value={[minRating]}
              onValueChange={(val) => setMinRating(val[0])}
              min={0}
              max={5}
              step={0.5}
              className="[&>[data-orientation=horizontal]>div]:bg-orange-600"
            />
            <div className="text-sm text-gray-500 mt-1">
              {minRating} ⭐ & above
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedCategories([]);
              setIsVeg(false);
              setMinRating(0);
              setPriceRange([100, 1000]);
            }}
            className="text-gray-600 hover:text-orange-600 hover:bg-orange-50"
          >
            Clear
          </Button>
          <DialogClose>
            <Button
              onClick={applyFilters}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6"
            >
              Apply
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterList;
