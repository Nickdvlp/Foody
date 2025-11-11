"use client";

import { useEffect, useState } from "react";
import { getRestaurant } from "../server/get-restaurant";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Dot,
  Edit,
  Loader2,
  Menu,
  MenuIcon,
  Plus,
  Trash2,
} from "lucide-react";
import ItemsTable from "../components/items-table";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddItems } from "@/modals/add-items";
import OrderStatusUpdate from "@/modals/order-status-update";
import { redirect } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getOrdersSeen } from "@/modules/order/server/get-orders-seen";
import { updateOrdersIsSeen } from "@/modules/order/server/update-orders-isSeen";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditRestaurant } from "@/modals/edit-restaurant";
import { DeleteRestaurant } from "@/modals/delete-restaurant";

export interface Restaurant {
  id: string;
  partnerId: string;
  name: string;
  address: string | null;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
interface RestaurantsViewProps {
  restaurantId: string;
}

const RestaurantView = ({ restaurantId }: RestaurantsViewProps) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [refreshItemsTable, setRefreshItemsTable] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [hasUnseenOrders, setHasUnseenOrders] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  useEffect(() => {
    const fetchRestaurant = async () => {
      const data = await getRestaurant({ restaurantId });
      setRestaurant(data);
    };
    fetchRestaurant();
  }, [restaurantId, editOpen, deleteOpen]);

  useEffect(() => {
    const fetchOrdersIsSeen = async () => {
      const data = await getOrdersSeen();
      const unseenExists = data.some((order) => order.isSeen === false);
      setHasUnseenOrders(unseenExists);
      console.log(unseenExists);
    };
    fetchOrdersIsSeen();
  }, [restaurantId]);

  const handleOrdersSeen = async () => {
    await updateOrdersIsSeen({ restaurantId });
    redirect(`/manage-orders/${restaurantId}`);
  };

  return (
    <div className="my-3 md:min-w-lg mx-3 p-3 shadow-xl rounded-2xl border border-gray-200">
      <div className="absolute top-8 right-20" onClick={handleOrdersSeen}>
        <Bell />
        {hasUnseenOrders && (
          <div className="bg-red-500 rounded-full absolute top-0 right-0 w-3 h-3 "></div>
        )}
      </div>
      {/* desktop card */}
      {restaurant ? (
        <div className=" md:flex hidden justify-between md:justify-around gap-3 px-5 ">
          <div className="flex items-center justify-center flex-col gap-2">
            <Image
              src={restaurant?.imageUrl ?? "/default-restaurant.png"}
              alt="restaurant logo"
              width={140}
              height={140}
              className="rounded-full border-4 border-orange-500 p-1 object-cover aspect-square"
            />
            <div className="text-lg font-bold text-gray-700">
              {restaurant?.name.toUpperCase()}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 py-3">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600">
                    <Plus />
                    Add Items
                  </Button>
                </DialogTrigger>
                <Button
                  className="hover:bg-orange-600"
                  onClick={() => redirect(`/manage-orders/${restaurant.id}`)}
                >
                  Manage Orders
                </Button>
                <AddItems
                  restaurantId={restaurant.id}
                  onSuccess={() => {
                    setOpen(false);
                    setRefreshItemsTable((prev) => prev + 1);
                  }}
                />
              </Dialog>
              <p className="text-lg text-gray-500 font-semibold">
                {restaurant?.description}
              </p>
            </div>
            <p className="text-sm text-muted-foreground font-semibold">
              ({restaurant?.address})
            </p>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex items-center justify-center h-full w-full">
          <Loader2 className="animate-spin text-orange-600" size={50} />
        </div>
      )}

      {/* mobile card */}
      {restaurant ? (
        <div>
          <div className="md:hidden">
            <SidebarTrigger>
              <Menu />
            </SidebarTrigger>
          </div>
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex items-center justify-center flex-col gap-3">
              <Image
                src={restaurant?.imageUrl ?? "/default-restaurant.png"}
                alt="restaurant logo"
                width={140}
                height={140}
                className="rounded-full border-4 border-orange-500 p-1 object-cover aspect-square"
              />
              <div className="text-lg font-bold text-gray-700">
                {restaurant?.name.toUpperCase()}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600">
                    <Plus />
                    Add Items
                  </Button>
                </DialogTrigger>
                <Button
                  className="hover:bg-orange-600"
                  onClick={() => redirect(`/manage-orders/${restaurant.id}`)}
                >
                  Manage Orders
                </Button>

                <AddItems
                  restaurantId={restaurant.id}
                  onSuccess={() => {
                    setOpen(false);
                    setRefreshItemsTable((prev) => prev + 1);
                  }}
                />
              </Dialog>
            </div>
          </div>

          <div className="mt-7 md:hidden flex flex-col items-center justify-center gap-1">
            <p className="text-md text-center text-gray-500 font-semibold">
              {restaurant?.description}
            </p>
            <p className="text-xs text-center text-muted-foreground font-semibold">
              ({restaurant?.address})
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full md:hidden w-full">
          <Loader2 className="animate-spin text-orange-600" size={50} />
        </div>
      )}

      <div className="border-2 rounded-2xl shadow-md mt-4">
        <ItemsTable
          restaurantId={restaurant?.id}
          refreshItemsTable={refreshItemsTable}
          setRefreshItemsTable={setRefreshItemsTable}
        />
      </div>
      <div className="absolute top-8 right-8">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="text-gray-600 hover:text-gray-800 transition">
            <MenuIcon size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit className="mr-2 size-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-white bg-red-500 hover:bg-red-700 hover:text-white mt-1"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-2 size-4 text-white hover:text-white" />{" "}
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <EditRestaurant
              restaurant={restaurant}
              onSuccess={() => setEditOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DeleteRestaurant
              restaurant={restaurant}
              onSuccess={() => setDeleteOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RestaurantView;
