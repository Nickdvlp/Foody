"use client";

import { useEffect, useState } from "react";
import { getPartner } from "../../server/get-partner";
import { Button } from "@/components/ui/button";
import {
  Edit,
  List,
  Loader2,
  MenuIcon,
  Plus,
  Trash2,
  MapPin,
  Menu,
  Megaphone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { redirect } from "next/navigation";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditPartner } from "@/modals/edit-partner";
import { DialogContent } from "@radix-ui/react-dialog";
import { DeletePartner } from "@/modals/delete-partner";
import AllRestaurants from "@/modules/restaurant/components/all-restaurants";
import { useDispatch } from "react-redux";

import { AppDispatch } from "@/store";
import { storePartner } from "@/store/partner/partnerSlice";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";

export interface Partner {
  id: string;
  name: string;
  userId: string;
  imageUrl: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PartnerViewProps {
  partnerId: string;
}

const PartnerView = ({ partnerId }: PartnerViewProps) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchPartner = async () => {
      const data = await getPartner({ partnerId });
      if (data) {
        setPartner(data);
        dispatch(storePartner(data));
      }
    };
    fetchPartner();
  }, [partnerId, editOpen, deleteOpen]);

  if (!partner) {
    return (
      <div className="flex items-center justify-center h-[100vh] gap-2">
        <Loader2 className="animate-spin text-orange-600" size={50} />
        <div className="text-orange-600 font-semibold text-center">Loading</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center p-3 bg-gradient-to-br from-orange-50 to-white">
        <div className="md:hidden m-2">
          <SidebarTrigger />
        </div>
        <div className="relative w-full max-w-4xl bg-transparent  p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 transition-all">
          {/* Dropdown Menu (top right) */}
          <div className="absolute top-4 right-4">
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
                <EditPartner
                  partner={partner}
                  onSuccess={() => setEditOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogContent>
                <DeletePartner
                  partner={partner}
                  onSuccess={() => setDeleteOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-40 w-40 rounded-full border-4 border-orange-100 overflow-hidden shadow-md">
              <img
                src={
                  partner?.imageUrl ||
                  "https://media.istockphoto.com/id/1288129985/vector/missing-image-of-a-person-placeholder.jpg?s=612x612&w=0&k=20&c=9kE777krx5mrFHsxx02v60ideRWvIgI1RWzR1X4MG2Y="
                }
                alt="partner-logo"
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-xs text-gray-500">Partner ID: {partner?.id}</p>
          </div>

          {/* Info Section */}
          <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              {partner?.name || "Loading..."}
            </h2>
            <p className="flex items-center text-gray-500 mb-4 text-sm">
              <MapPin className="size-4 mr-1 text-orange-500" />
              {partner?.address || "No address available"}
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm flex items-center gap-2"
                onClick={() => {
                  setIsLoading(true);
                  redirect(`/create-restaurant/${partner?.id}`);
                }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
                Add Restaurant
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <AllRestaurants partnerId={partner.id} />
      </div>
    </div>
  );
};

export default PartnerView;
