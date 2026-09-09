import { createFileRoute } from "@tanstack/react-router";
import  Hero  from "@/sections/Hero";
import  GalleryPreview from "@/sections/GalleryPreview";
import {
  PastorQuote,
  BuiltForImpact,
  FutureSection
} from "@/sections/ExpandedSections";
import Family from "@/sections/Family";
import Events from "@/sections/Events";
import WorkforceSection from "@/sections/WorkforceSection";

export const Route = createFileRoute("/")({
  component: LandingView,
});

function LandingView() {
  return (
    <div className="min-h-screen text-center ">
      <Hero />
      <PastorQuote />
      <Family />
      <BuiltForImpact />
      <GalleryPreview />
      <FutureSection />
      <Events />
      <WorkforceSection />
    </div>
  );
}
