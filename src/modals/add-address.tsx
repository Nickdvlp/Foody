"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setAddress } from "@/modules/checkout/server/set-address";
import { createItems } from "@/modules/items/server/create-items";

import Uploader from "@/modules/partner/ui/uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, {
    message: "Phone number must be with 10 numbers.",
  }),

  street: z.string(),
  city: z.string().min(3, { message: "Please provide correct city." }),
  state: z.string().min(3, { message: "Please provide correct state." }),
  postalCode: z.string().min(5, { message: "Please provide correct code." }),
});

interface AddAddressProps {
  closeDialog: () => void;
  setUpdateAddressList: (val: any) => void;
}

export function AddAddress({
  closeDialog,
  setUpdateAddressList,
}: AddAddressProps) {
  const [loading, setLoading] = useState<Boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      street: "",
      city: "",
      postalCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await setAddress({ values });
    setLoading(false);
    setUpdateAddressList((prev: any) => prev + 1);
    closeDialog();
    toast.success("address created successfully.");
    form.reset();
  };

  return (
    <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Address</DialogTitle>
        <DialogDescription>
          Provide your address where you want to deliver your food!
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="*:pt-4 ">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your contact no." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input placeholder="Enter street name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter postal code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {loading ? (
              <Button>
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button type="submit" className="bg-orange-600">
                Save
              </Button>
            )}
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
