import Masthead from "@/components/masthead/Masthead";
import Hero from "@/components/hero/Hero";
import Leaves from "@/components/leaves/Leaves";
import Legend from "@/components/legend/Legend";
import Brew from "@/components/brew/Brew";
import Manners from "@/components/manners/Manners";
import Closer from "@/components/closer/Closer";
import Feast from "@/components/feast/Feast";
import Credits from "@/components/credits/Credits";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Masthead />
      <main id="main">
        <Hero />
        <Leaves />
        <Feast />
        <Legend />
        <Brew />
        <Manners />
        <Closer />
      </main>
      <Credits />
    </>
  );
}
