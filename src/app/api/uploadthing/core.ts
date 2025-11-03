import { db } from "@/db";
import { partnerTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const { userId } = await auth();
      console.log(userId);
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })

    .onUploadComplete(async ({ file, metadata }) => {
      // await db.insert(partnerTable).values({
      //   ownername: "unknown",
      //   restaurantname: "unknown",
      //   imageUrl: file.ufsUrl,
      //   userId: metadata.userId,
      //   address: "unknown",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // });

      console.log("file url", file.ufsUrl);

      return { image: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
