"use client";

import { navItems } from "@/data";

import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Approach from "@/components/Approach";
import RecentProjects from "@/components/RecentProjects";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import Technologies from "@/components/Technologies";
import SceneCanvas from "@/components/ui/SceneCanvas";

const Home = () => {
  return (
    <main className="relative flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      {/* persistent WebGL layer — the blob travels with you through the page */}
      <SceneCanvas />
      <div className="max-w-7xl w-full relative z-10">
        <FloatingNav navItems={navItems} />
        <Hero />
        <Grid />
        <RecentProjects />
        <Technologies />
        <Approach />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
