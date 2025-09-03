
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AttractionsSection from "@/components/AttractionsSection";
import ExperiencesSection from "@/components/ExperiencesSection";
import InfoSection from "@/components/InfoSection";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AttractionsSection />
      <ExperiencesSection />
      <ReviewsSection />
      <InfoSection />
      <Footer />
    </div>
  );
};

export default Index;
