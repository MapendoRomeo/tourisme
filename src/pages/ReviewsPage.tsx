
import Navigation from "@/components/Navigation";
import ReviewsSection from "@/components/reviews/ReviewsSection";

const ReviewsPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <ReviewsSection />
      </div>
      
      {/* Footer */}
      <footer className="bg-ocean-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="font-display text-2xl font-bold">
              Ville<span className="font-script text-sunset-200">Voyage</span>
            </h3>
          </div>
          <p className="text-white/70 mb-4">
            Votre guide pour découvrir la magie de Saint-Tropez
          </p>
          <div className="border-t border-white/20 pt-4">
            <p className="text-sm text-white/50">
              © 2024 VilleVoyage. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReviewsPage;
