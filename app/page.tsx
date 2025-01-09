import Image from "next/image";
import { Navbar } from "./customComponents/Navbar";
import { Hero } from "./customComponents/Hero";

export default function Home() {
  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <nav>
        <Navbar />
      </nav>

      <Hero />
    </main>
  );
}
