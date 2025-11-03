"use client";

import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";

interface UploaderProps {
  setImageUrl: (ufsUrl: string) => void;
  imageUrl: string;
}

export default function Uploader({ setImageUrl, imageUrl }: UploaderProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Image Preview */}
      <div className="relative h-20 w-20 overflow-hidden rounded-full border">
        <Image
          src={
            imageUrl ||
            "https://media.istockphoto.com/id/1288129985/vector/missing-image-of-a-person-placeholder.jpg?s=612x612&w=0&k=20&c=9kE777krx5mrFHsxx02v60ideRWvIgI1RWzR1X4MG2Y="
          }
          alt="Preview"
          fill
          className="object-cover rounded-full"
        />
      </div>

      {/* Upload Button */}
      <UploadButton
        endpoint="imageUploader"
        appearance={{
          button: {
            background: "#EC571D",
            color: "white",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem",
            fontWeight: "600",
          },
        }}
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            console.log(res[0].ufsUrl);
            setImageUrl(res[0].ufsUrl); // set uploaded image
          }
        }}
        onUploadError={(error) => alert(`Upload failed: ${error.message}`)}
      />
    </div>
  );
}
