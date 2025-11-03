import PartnerLayout from "@/modules/partner/layouts/partner-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PartnerLayout>{children}</PartnerLayout>;
}
