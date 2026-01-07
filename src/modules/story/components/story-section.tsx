import { AddStoryModal } from "@/modals/add-story-modal";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getAllStories } from "../server/get-all-stories";
import { StoryWindow } from "@/modals/story-window";
import { checkAddStory } from "../server/check-add-story";

interface Story {
  storyId: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption: string | null;
  createdAt: Date;
  expiresAt: Date;
  restaurant: {
    id: string;
    name: string;
    imageUrl: string | null;
    address: string | null;
  };
}
const StorySection = () => {
  const [canAddStory, setCanAddStory] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [stories, setStories] = useState<Story[] | null>(null);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  useEffect(() => {
    const getStories = async () => {
      const storiesData = await getAllStories();
      setStories(storiesData);
    };

    getStories();
  }, []);

  useEffect(() => {
    const checkAddStoryFunc = async () => {
      const checkAddStoryData = await checkAddStory();
      setCanAddStory(checkAddStoryData);
    };

    checkAddStoryFunc();
  }, []);

  return (
    <div className="h-20 flex items-center gap-5 px-5 overflow-x-auto no-scrollbar snap-x snap-mandatory ml-2 mt-2">
      {canAddStory && (
        <div
          className="h-18 w-18 shrink-0 snap-start rounded-full bg-transparent border-4 border-orange-400  items-center justify-center flex font-semibold text-orange-400 border-dashed  cursor-pointer
"
          onClick={() => setIsOpen(true)}
        >
          Add +
        </div>
      )}

      {stories &&
        stories.map((story, i) => (
          <div
            key={i}
            className="h-18 w-18 shrink-0 snap-start rounded-full  border-4 border-orange-400 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => {
              setActiveStoryId(story.storyId);
            }}
          >
            <Image
              src={story?.restaurant?.imageUrl ?? "/icon.png"}
              alt="bg-image"
              width={50}
              height={50}
              className="object-cover  w-full h-full"
            />
          </div>
        ))}

      <div className="w-5 shrink-0" />
      <div>
        <AddStoryModal isOpen={isOpen} setIsOpen={setIsOpen} />
        {activeStoryId && (
          <StoryWindow
            storyId={activeStoryId}
            onClose={() => setActiveStoryId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default StorySection;
