import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { Proof } from "@/components/home/Proof";
import { Work } from "@/components/home/Work";

export default function Home() {
  return (
    <>
      <Hero />
      <Proof />
      <Work />
      <Experience />
      <About />
      <Contact />
    </>
  );
}
