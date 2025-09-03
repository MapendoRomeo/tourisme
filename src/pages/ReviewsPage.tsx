
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ReviewsSection from "@/components/reviews/ReviewsSection";

const ReviewsPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="">
        <div className="bg-gradient-to-r from-ocean-600 to-ocean-500 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Avis de nos visiteurs
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Découvrez ce que pensent les autres voyageurs de Idjwi
            </p>
          </div>
        </div>
        <ReviewsSection hideDiv={true} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ReviewsPage;
