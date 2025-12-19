"use server";

import { getGeoCode } from "@/utils/getGeoCode";

interface getLatLongProps {
  data: {
    userAddress: {
      street: string;
      city: string;
      state: string;
    };
    restaurantAddress: {
      address: string | null;
    };
  };
}
export const getLatLong = async ({ data }: getLatLongProps) => {
  const userdata = `${data.userAddress.street}, ${data.userAddress.city}, ${data.userAddress.state}`;

  const restaurantData = data.restaurantAddress.address || "";

  const [userCoords, restaurantCoords] = await Promise.all([
    getGeoCode({ address: userdata }),
    getGeoCode({ address: restaurantData }),
  ]);

  return { userCoords, restaurantCoords };
};
