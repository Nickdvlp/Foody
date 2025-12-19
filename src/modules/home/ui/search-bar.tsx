"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setSearchQuery } from "@/store/food/foodSlice";

interface SearchBarProps {
  isMobile: boolean;
}

const SearchBar = ({ isMobile }: SearchBarProps) => {
  const dispatch = useDispatch();
  const query = useSelector((state: RootState) => state.food.searchQuery);

  return (
    <div
      className={cn(
        isMobile ? "flex" : "hidden md:flex",
        "md:flex-1 items-center justify-center md:gap-2 gap-0"
      )}
    >
      <Input
        value={query}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="md:w-96 w-48"
        placeholder="Search your food..."
      />
      <Button className="bg-transparent hover:bg-transparent border">
        <SearchIcon className="text-gray-400" />
      </Button>
    </div>
  );
};

export default SearchBar;
