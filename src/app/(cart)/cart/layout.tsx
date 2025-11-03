import HomeLayout from "@/modules/home/layouts/HomeLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <HomeLayout>{children}</HomeLayout>;
}
