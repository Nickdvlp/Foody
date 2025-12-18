import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ReduxProvider } from "@/providers/ReduxProvider";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Foody",
  description: "Your food hub",
  icons: {
    icon: "./icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ReduxProvider>
            <ToastProvider>{children}</ToastProvider>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
