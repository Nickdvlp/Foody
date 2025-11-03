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
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Uploader from "@/modules/partner/ui/uploader";
import { updateItem } from "@/modules/items/server/update-item";

const formSchema = z.object({
  imageUrl: z.string().url({ message: "Please upload an image." }),
  name: z
    .string()
    .min(2, { message: "Item name must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  price: z.string(),
  preparationTime: z.string(),
  ingredients: z.string(),
  isAvailable: z.boolean(),
});

interface EditItemProps {
  item: any;
  onSuccess: () => void;
}

export function EditItemModal({ item, onSuccess }: EditItemProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: item.imageUrl || "",
      name: item.name,
      description: item.description,
      price: item.price,
      preparationTime: String(item.preparationTime),
      ingredients: item.ingredients?.join(", ") || "",
      isAvailable: item.isAvailable,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await updateItem(item.id, values);
    onSuccess();
    setLoading(false);
  };

  return (
    <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogDescription>
          Update the details of <strong>{item.name}</strong>.
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
                  <Input placeholder="Enter Description" {...field} />
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
                  <Input placeholder="Set Price" {...field} />
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
                <FormLabel>Preparation Time (mins)</FormLabel>
                <FormControl>
                  <Input placeholder="Preparation Time" {...field} />
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
                    placeholder="Enter ingredients, separated by commas"
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
              <Button disabled>
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <DialogClose asChild>
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500"
                >
                  Save Changes
                </Button>
              </DialogClose>
            )}
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
