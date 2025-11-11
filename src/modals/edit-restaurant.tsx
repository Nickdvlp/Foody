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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Uploader from "@/modules/partner/ui/uploader";
import { updateRestaurant } from "@/modules/restaurant/server/update-restaurant";

interface Restaurant {
  id: string;
  partnerId: string;
  name: string | undefined;
  address: string | undefined;
  description: string | undefined;
  imageUrl: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

const formSchema = z.object({
  imageUrl: z.string().url({ message: "Please upload an image." }),
  name: z
    .string()
    .min(2, { message: "Item name must be at least 2 characters." }),
  address: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
});

interface EditItemProps {
  restaurant: Restaurant | null;
  onSuccess: () => void;
}

export function EditRestaurant({ restaurant, onSuccess }: EditItemProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: restaurant?.imageUrl,
      name: restaurant?.name,
      address: restaurant?.address,
      description: restaurant?.description,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!restaurant?.id) return;
    setLoading(true);
    await updateRestaurant({ restaurantId: restaurant.id, values });
    onSuccess();
    setLoading(false);
    console.log(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogDescription>
          Update the details of <strong>{restaurant?.name}</strong>.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Uploader
                    imageUrl={field.value}
                    setImageUrl={(url) => form.setValue("imageUrl", url)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Food Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Description" {...field} />
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
              <Button disabled>
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500"
              >
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
