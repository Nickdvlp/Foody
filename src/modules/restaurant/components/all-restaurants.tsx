"use client";
import RestaurantsCard from "./restaurants-card";

interface AllRestaurantsProps {
  partnerId: string;
}
const AllRestaurants = ({ partnerId }: AllRestaurantsProps) => {
  return (
    <div className=" bg-gradient-to-br from-orange-50 to-white">
      <div className="flex px-4 py-2 justify-between items-center m-3 ">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Your Restaurants</h1>
          <p className="text-xs ml-1 text-muted-foreground">
            You can manage restaurants
          </p>
        </div>
      </div>

      <div className="m-3">
        <RestaurantsCard partnerId={partnerId} />
      </div>
    </div>
  );
};

export default AllRestaurants;
