import Image from "next/image";
import Monopoly from "@/app/assets/Monopoly.jpg"

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <Image
      className="mx-auto"
      src={Monopoly}
      alt="Usury Pay"
      width={300}
      priority
      />
      
      <h1 className="text-6xl font-bold pb-60">
        Usury Pay
      </h1>
    </div>
  );
}