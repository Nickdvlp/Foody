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
import { createItems } from "@/modules/items/server/create-items";

import Uploader from "@/modules/partner/ui/uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  imageUrl: z.string().url({ message: "Please upload an image." }),
  name: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  description: z.string().min(20, {
    message: "description must be at least 20 characters.",
  }),

  price: z.string(),
  preparationTime: z.string(),

  ingredients: z.string(),
  isAvailable: z.boolean(),
  category: z.string(),
});

interface addItemsProps {
  restaurantId: string;
  onSuccess?: () => void;
}

export function AddItems({ restaurantId, onSuccess }: addItemsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
      name: "",
      description: "",
      price: "0",
      preparationTime: "0",
      ingredients: "",
      isAvailable: true,
      category: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    console.log(values);
    await createItems({ values, restaurantId });
    onSuccess?.();
    setLoading(false);
    form.reset();
  };
  return (
    <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Items</DialogTitle>
        <DialogDescription>
          Enter the details of food items which you want to add in your
          restaurant menu list
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="*:pt-4 ">
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
                  <Input placeholder="Enter Food Name" {...field} />
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
                  <Input placeholder="Description of Food" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Set Price of Food" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preparationTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preparation Time</FormLabel>
                <FormControl>
                  <Input placeholder="Enter approx preparing time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ingredients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingredients</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Ingredients with commas"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Add food category (eg. pizza, burger, dessert, drinks)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-4 h-4 accent-orange-600"
                    />
                    <span className="text-sm text-muted-foreground">
                      Available for order
                    </span>
                  </div>
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
