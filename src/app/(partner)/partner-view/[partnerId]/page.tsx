import PartnerView from "@/modules/partner/ui/view/partner-view";
import React from "react";

interface PageProps {
  params: Promise<{ partnerId: string }>;
}
const page = async ({ params }: PageProps) => {
  const { partnerId } = await params;

  return (
    <div>
      <PartnerView partnerId={partnerId} />
    </div>
  );
};

export default page;
