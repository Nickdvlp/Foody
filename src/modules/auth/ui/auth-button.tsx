"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { CalendarClock, ClapperboardIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPartner } from "../server/fetch-partner";

interface Partner {
  id: string;
  name: string;
  userId: string;
  imageUrl: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuthButton = () => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPartner = async () => {
      setLoading(true);
      if (!user?.id) return;
      const data = await fetchPartner(user.id);
      setPartner(data);
      setLoading(false);
    };
    getPartner();
  }, [user?.id]);

  return (
    <div>
      <SignedOut>
        <SignInButton>
          <button className="bg-orange-400 text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            {loading ? (
              <UserButton.Link
                label="Loading..."
                href="#"
                labelIcon={
                  <ClapperboardIcon className="size-4 animate-pulse" />
                }
              />
            ) : !partner ? (
              <UserButton.Link
                label="Become a Partner"
                href="/create-partner"
                labelIcon={<ClapperboardIcon className="size-4" />}
              />
            ) : (
              <UserButton.Link
                label="Partner Dashboard"
                href={`/partner-view/${partner.id}`}
                labelIcon={<ClapperboardIcon className="size-4" />}
              />
            )}
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Your Orders"
              href={`/orders`}
              labelIcon={<CalendarClock className="size-4" />}
            />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
    </div>
  );
};

export default AuthButton;
