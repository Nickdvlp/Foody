import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getPartnerRestaurants } from "@/modules/restaurant/server/get-partner-restaurants";
import { addToStory } from "@/modules/story/server/add-to-story";
import { UploadButton } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";

import { Image, Loader2, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import z from "zod";

interface AddStoryDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

interface Restaurants {
  id: string;
  partnerId: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const formSchema = z.object({
  restaurantId: z.string().min(1, "Select a restaurant"),
  caption: z.string(),
  mediaType: z.enum(["image", "video"]),
  mediaUrl: z.string(),
});
export const AddStoryModal = ({ isOpen, setIsOpen }: AddStoryDialogProps) => {
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurants[] | null>(null);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantId: "",
      caption: "",
      mediaType: "image",
      mediaUrl: "",
    },
  });
  useEffect(() => {
    const getRestaurants = async () => {
      const restaurantsData = await getPartnerRestaurants();
      setRestaurants(restaurantsData);
    };
    getRestaurants();
  }, []);

  const onSubmit = async () => {
    const values = form.getValues();
    const data = await addToStory({ values });
    if (data.message) {
      toast.success(data.message);
    }
    setIsOpen(false);
    form.reset();
  };

  const handleUploadComplete = (
    res: { url: string }[],
    type: "image" | "video"
  ) => {
    if (!res || !res[0]) return;

    form.setValue("mediaUrl", res[0].url);
    form.setValue("mediaType", type);
    setMedia(res[0].url);
    setMediaType(type);
    console.log(media, mediaType);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a post</DialogTitle>
          <DialogDescription>Put the details of your story</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Write your caption..."
                        wrap="soft"
                        className="w-full min-h-[120px] overflow-y-auto overflow-x-hidden resize-none break-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              <FormField
                control={form.control}
                name="restaurantId"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a restaurant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Restaurants</SelectLabel>
                            {restaurants?.map((restaurant) => (
                              <SelectItem
                                key={restaurant.id}
                                value={restaurant.id}
                              >
                                {restaurant.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="p-2 flex items-center justify-between">
              <div className="flex gap-3">
                <Button className="bg-gray-600" type="button">
                  <UploadButton
                    endpoint="storyMediaUploader"
                    appearance={{
                      container: "p-0 border-none bg-transparent w-fit",
                      allowedContent: "hidden",
                    }}
                    onUploadBegin={() => {
                      setIsVideoUploading(true);
                    }}
                    onClientUploadComplete={(res) => {
                      handleUploadComplete(res, "video");
                      setIsVideoUploading(false);
                    }}
                    onUploadError={(error) => {
                      console.error(error);
                      setIsVideoUploading(false);
                    }}
                    content={{
                      button: (
                        <div
                          className={`p-2 rounded-md ${
                            isVideoUploading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gray-600 hover:bg-gray-700 cursor-pointer"
                          }`}
                        >
                          {isVideoUploading ? (
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                          ) : (
                            <Video className="h-4 w-4 text-white" />
                          )}
                        </div>
                      ),
                    }}
                  />
                </Button>
                <Button className="bg-gray-600" type="button">
                  <UploadButton
                    endpoint="storyMediaUploader"
                    appearance={{
                      container: "p-0 border-none bg-transparent w-fit",
                      allowedContent: "hidden",
                    }}
                    onUploadBegin={() => {
                      setIsImageUploading(true);
                    }}
                    onClientUploadComplete={(res) => {
                      handleUploadComplete(res, "image");
                      setIsImageUploading(false);
                    }}
                    onUploadError={(error) => {
                      console.error(error);
                      setIsImageUploading(false);
                    }}
                    content={{
                      button: (
                        <div
                          className={`p-2 rounded-md ${
                            isImageUploading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gray-600 hover:bg-gray-700 cursor-pointer"
                          }`}
                        >
                          {isImageUploading ? (
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                          ) : (
                            <Image className="h-4 w-4 text-white" />
                          )}
                        </div>
                      ),
                    }}
                  />
                </Button>
              </div>
              <div className="flex gap-3">
                <DialogClose>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  className="bg-orange-400 hover:bg-orange-500"
                  type="submit"
                >
                  Post
                </Button>
              </div>
            </div>
          </form>
        </Form>
        {media && (
          <div>
            {mediaType === "image" ? (
              <img src={media} />
            ) : (
              <video
                src={media}
                controls
                className="w-full max-h-[400px] object-contain bg-black"
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
