
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExploreCity = () => {
    // Scroll to attractions section
    document.getElementById('attractions')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handlePlanTrip = () => {
    // Scroll to contact section
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section id="home" className="hero-section">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-overlay"></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full animate-float"></div>
      <div className="absolute bottom-32 right-20 w-16 h-16 bg-sunset-500/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-nature-500/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="hero-content">
        <h1 className="hero-title">
          Découvrez la Magie de
          <br />
          <span className="font-script text-sunset-200">Idjwi</span>
        </h1>

        <p className="hero-subtitle">
          Une destination où l'élégance méditerranéenne rencontre l'art de vivre
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="btn-hero" onClick={handleExploreCity}>
            Explorer la ville
          </Button>
          <Button className="btn-cta" onClick={handlePlanTrip}>
            Planifier mon séjour
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
