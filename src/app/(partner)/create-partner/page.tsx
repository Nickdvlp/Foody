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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createPartner } from "@/modules/partner/server/create-partner";
import Uploader from "@/modules/partner/ui/uploader";
import { useUser } from "@clerk/nextjs";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Owner name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  mobileNumber: z
    .string()
    .min(13, { message: "Mobile Number must be 10 digits." })
    .max(13, { message: "Mobile Number must be 10 digits." }),
  email: z.string(),
  imageUrl: z.string().url({ message: "Please upload an image." }),
});

function Page() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      imageUrl: "",
      mobileNumber: "+91",
      email: user?.primaryEmailAddress?.emailAddress,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const partner = await createPartner({ values });
      router.push(`/partner-view/${partner.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <SidebarTrigger className="mx-3 my-2 md:hidden" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
        <Card className="flex items-center justify-center w-full max-w-sm mx-auto">
          <CardHeader className="w-full text-center">
            <CardTitle className="text-xl">Become a Partner</CardTitle>
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

            {/* Owner */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Home Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Mobile Number" {...field} />
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

export default Page;
