"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
  restaurantName?: string;
}

export function RatingDialog({
  open,
  onClose,
  onSubmit,

  restaurantName,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return alert("Please select a rating before submitting.");
    onSubmit(rating, review);
    setReview("");
    setRating(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Rate {restaurantName || "your order"}
          </DialogTitle>
        </DialogHeader>

        {/* ⭐ Rating Section */}
        <div className="flex justify-center gap-1 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-7 h-7 cursor-pointer transition-all ${
                (hoverRating || rating) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>

        {/* 💬 Review Textarea */}
        <Textarea
          placeholder="Share your experience (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="resize-none h-28"
        />

        {/* ✅ Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
