import Image from "next/image";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <Image
        src="/bg-img.png"
        alt="Loading food"
        width={280}
        height={280}
        priority
        className="animate-pulse"
      />
    </div>
  );
}
