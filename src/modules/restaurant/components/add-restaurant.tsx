"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPartner } from "@/modules/partner/server/create-partner";
import Uploader from "@/modules/partner/ui/uploader";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createRestaurant } from "../server/create-restaurant";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import toast from "react-hot-toast";

interface AddRestaurantProps {
  partnerId: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Owner name must be at least 2 characters.",
  }),
  imageUrl: z.string().url({ message: "Please upload an image." }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 60 characters" }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
});

function AddRestaurant({ partnerId }: AddRestaurantProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      description: "",
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const restaurantId = await createRestaurant({ values, partnerId });
      toast.success("restaurant created");
      router.push(`/restaurant-view/${restaurantId}`);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <SidebarTrigger className="md:hidden mx-3 my-2" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
        <Card className="flex items-center justify-center w-full max-w-sm mx-auto">
          <CardHeader className="w-full text-center">
            <CardTitle className="text-xl">Start Your Restaurant</CardTitle>
            <CardDescription>Enter details to start</CardDescription>
          </CardHeader>
          <CardContent className="my-2 *:mb-6 w-full">
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
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Restaurant Name" {...field} />
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
                    <Textarea
                      className="resize-none"
                      placeholder="Enter Description for Restaurant"
                      {...field}
                    />
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
                    <Input
                      placeholder="Enter Your Restaurant Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoading ? (
              <Button
                type="submit"
                className="mt-5 bg-orange-600 hover:bg-orange-700"
              >
                <Loader2 className="animate-spin" size={4} />
              </Button>
            ) : (
              <Button
                type="submit"
                className="mt-5 bg-orange-600 hover:bg-orange-700"
              >
                Submit
              </Button>
            )}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

export default AddRestaurant;
