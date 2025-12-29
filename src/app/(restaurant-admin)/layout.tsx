import RestaurantLayout from "@/modules/restaurant/layouts/restaurant-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RestaurantLayout>{children}</RestaurantLayout>;
}
