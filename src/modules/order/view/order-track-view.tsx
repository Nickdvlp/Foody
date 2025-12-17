"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Headset, MoveLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getTrackingAddresses } from "../server/get-tracking-addresses";
import { getLatLong } from "../server/get-latLong";
import { RouteMapProps } from "@/components/map-component";

interface OrderTrackViewProps {
  orderId: string;
}

const DynamicMap = dynamic<RouteMapProps>(
  () => import("@/components/map-component"),
  {
    ssr: false,
    loading: () => (
      <p className="text-center text-gray-500 mt-4">Loading map...</p>
    ),
  }
);

interface Addresses {
  userCoords:
    | "We couldn't find that address!"
    | {
        lat: any;
        lon: any;
      };
  restaurantCoords:
    | "We couldn't find that address!"
    | {
        lat: any;
        lon: any;
      };
}
const OrderTrackView = ({ orderId }: OrderTrackViewProps) => {
  const [addresses, setAddresses] = useState<Addresses | null>(null);
  useEffect(() => {
    const fetchTrackingAddresses = async () => {
      const data = await getTrackingAddresses({ orderId });
      const pos = await getLatLong({ data });

      setAddresses(pos);
    };
    fetchTrackingAddresses();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between p-4 md:px-8 md:py-4 border-b shadow-md">
        <MoveLeft
          className="text-sm text-orange-600 font-bold"
          onClick={() => redirect("/orders")}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center gap-2 font-semibold text-orange-600">
              <Headset className="w-5 h-5 text-orange-600" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="z-[2000]">
            <p>Talk to us for any complaint or query.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="h-[80vh]">
        {addresses ? (
          <DynamicMap addresses={addresses} />
        ) : (
          <p className="text-center mt-4 text-gray-500">Fetching location...</p>
        )}
      </div>
    </div>
  );
};

export default OrderTrackView;
