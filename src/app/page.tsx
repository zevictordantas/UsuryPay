import Image from 'next/image';
import Monopoly from '@/app/assets/Monopoly.jpg';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Image
        className="mx-auto"
        src={Monopoly}
        alt="Usury Pay"
        width={300}
        priority
      />

      <h1 className="pb-60 text-6xl font-bold">Usury Pay</h1>
    </div>
  );
}
