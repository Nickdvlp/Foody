"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteItem } from "@/modals/delete-Item";
import { EditItemModal } from "@/modals/edit-item-modal";
import { EditItem } from "@/modules/items/server/edit-item";
import { getFoodItems } from "@/modules/items/server/get-food-items";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ItemsTableProps {
  restaurantId: string | undefined;
  refreshItemsTable: number;
  setRefreshItemsTable: (value: number) => void;
}

interface FoodItem {
  id: string;
  name: string;
  restaurantId: string;
  description: string;
  price: string;
  preparationTime: number;
  ingredients: string[] | null;
  imageUrl: string | null;
  isAvailable: boolean;
  category: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const ItemsTable = ({
  restaurantId,
  refreshItemsTable,
  setRefreshItemsTable,
}: ItemsTableProps) => {
  const [foodItems, setFoodItems] = useState<FoodItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!restaurantId) return;

    const fetchFoodItems = async () => {
      try {
        setIsLoading(true);
        const data = await getFoodItems({ restaurantId });
        setFoodItems(data);
      } catch (err) {
        console.error("Failed to fetch food items:", err);
        setFoodItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItems();
  }, [restaurantId, refreshItemsTable]);

  const onDelete = async (id: string) => {
    const updateItem = await EditItem({ id });
    setFoodItems(updateItem);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="animate-spin text-orange-600" size={50} />
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your restaurant's food items </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>description</TableHead>
            <TableHead className="text-left">Price</TableHead>
            <TableHead className="text-right"> Time</TableHead>
            <TableHead className="text-right">Ingredients</TableHead>
            <TableHead className="text-right">Category</TableHead>
            <TableHead className="text-right">Availability</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foodItems?.map((item) => (
            <TableRow>
              <TableCell>
                <Image
                  src={item.imageUrl ? item.imageUrl : "/icon.png"}
                  alt={item.name}
                  width={50}
                  height={50}
                />
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.description.slice(0, 30)}...</TableCell>
              <TableCell>₹{item.price}</TableCell>
              <TableCell className="text-right">
                {item.preparationTime}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="border px-2 hover:bg-black hover:text-white rounded-2xl">
                    See list
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.ingredients?.map((ing, idx) => (
                      <span key={idx} className="px-1">
                        {ing.split(",")}
                      </span>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="text-right pr-4">{item.category}</TableCell>
              <TableCell className="text-right pr-4">
                {item.isAvailable ? "YES" : "NO"}
              </TableCell>
              <TableCell className="flex items-center justify-center gap-1">
                <Dialog>
                  <DialogTrigger>
                    <Button className="text-xs px-4 py-2 bg-orange-600">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <EditItemModal
                      item={item}
                      onSuccess={() => setRefreshItemsTable(Date.now())}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger>
                    <Button className="text-xs px-4 py-2 bg-orange-600">
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DeleteItem onDelete={() => onDelete(item.id)} />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemsTable;
