"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import React from "react";
import { getTopRatedItems } from "../server/get-top-rated";

const TopRatedButton = () => {
  // const [topRatedItems, setTopRatedItems] = useState(null);

  const handleTopRated = async () => {
    const data = await getTopRatedItems();
    console.log(data);
  };

  return (
    <div>
      <div>
        <Button
          variant="outline"
          className="py-2 px-4 rounded-xl border border-orange-200 text-orange-600 font-medium bg-orange-50/40 hover:bg-orange-100 transition-all shadow-sm hover:shadow-md"
          onClick={handleTopRated}
        >
          <Star size={20} />
          Top Rated
        </Button>
      </div>
    </div>
  );
};

export default TopRatedButton;
