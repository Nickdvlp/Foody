"use client";

import { Heart, Loader2, MessageCircle, Share, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getStory } from "@/modules/story/server/get-story";

interface StoryWindowProps {
  storyId: string;
  onClose: () => void;
}

interface Story {
  story: {
    id: string;
    restaurantId: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    caption: string | null;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
  };
  restaurants: {
    id: string;
    partnerId: string;
    name: string;
    imageUrl: string | null;
    description: string | null;
    address: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}
export const StoryWindow = ({ storyId, onClose }: StoryWindowProps) => {
  const [story, setStory] = useState<Story[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStoryData = async () => {
      const storyData = await getStory({ storyId });
      setStory(storyData);
      setLoading(false);
    };
    getStoryData();
  }, [storyId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={50} />
      </div>
    );
  }

  if (!story) return null;

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black text-white h-screen">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-50 bg-black/60 p-3 rounded-full backdrop-blur-sm cursor-pointer"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Media */}
        <div className="relative w-full h-full">
          {story[0].story.mediaType === "image" ? (
            <img
              src={story[0].story.mediaUrl}
              alt="story"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              src={story[0].story.mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-contain"
            />
          )}

          {/* Right side actions */}
          <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center">
            <button className="flex flex-col items-center bg-black/60 p-3 rounded-full backdrop-blur-sm">
              <Heart className="h-6 w-6 text-white" />
            </button>

            <button className="flex flex-col items-center bg-black/60 p-3 rounded-full backdrop-blur-sm">
              <MessageCircle className="h-7 w-7" />
            </button>

            <button className="flex flex-col items-center bg-black/60 p-3 rounded-full backdrop-blur-sm">
              <Share className="h-7 w-7" />
            </button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-2 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="font-semibold text-sm">{story[0].restaurants.name}</p>
            {story[0].story.caption && (
              <p className="text-sm mt-1 line-clamp-2">
                {story[0].story.caption}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
