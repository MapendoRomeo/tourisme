
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ThumbsUp, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ReviewsSection = () => {
  const [selectedAttraction, setSelectedAttraction] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // State for managing reviews
  const [reviews, setReviews] = useState([])
  const [attractions, setAttractions] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reviewsData, attractionData] = await Promise.all([
          apiService.getReviews(),
          apiService.getAttractions(),
        ]);
        setReviews(reviewsData);
        setAttractions(attractionData);
      } catch {
        toast({ title: "Erreur", description: "Impossible de charger les données administrateur.", variant: "destructive" });
      }
    };
    fetchAll();
  }, []);
  // Only show approved reviews
  const approvedReviews = reviews.filter(review => review.status === 'approved');
  const filteredReviews = selectedAttraction === "all"
    ? approvedReviews
    : approvedReviews.filter(review => review.attraction === selectedAttraction);

  const averageRating = approvedReviews.length > 0
    ? approvedReviews.reduce((acc, review) => acc + review.rating, 0) / approvedReviews.length
    : 0;

  const handleNewReview = async (newReview: any) => {
    try {
      await apiService.createReview(newReview)
      setIsDialogOpen(false);
    } catch {

    }

  };

  const handleLike = (reviewId: number) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, likes: review.likes + 1 }
          : review
      )
    );
    toast({
      title: "Merci !",
      description: "Votre like a été pris en compte.",
    });
  };

  return (
    <section id="reviews" className="section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title text-ocean-900">
            Avis de nos visiteurs
          </h2>
          <p className="section-subtitle">
            Découvrez ce que pensent les autres voyageurs de Saint-Tropez
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 font-semibold text-ocean-900">
                {averageRating.toFixed(1)}/5
              </span>
            </div>
            <span className="text-muted-foreground">
              ({approvedReviews.length} avis)
            </span>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {/* Bouton "Toutes" */}
          <Button
            variant={selectedAttraction === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedAttraction("all")}
            className={selectedAttraction === "all" ? "bg-ocean-500 hover:bg-ocean-600" : ""}
          >
            Toutes
          </Button>

          {/* Boutons pour chaque attraction */}
          {attractions.map((attraction) => (
            <Button
              key={attraction.id}
              variant={selectedAttraction === attraction.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedAttraction(attraction.id)}
              className={selectedAttraction === attraction.id ? "bg-ocean-500 hover:bg-ocean-600" : ""}
            >
              {attraction.name}
            </Button>
          ))}
        </div>

        {/* Liste des avis - Ne montrer que les 4 premiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredReviews.slice(0, 4).map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ocean-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {review.avatar}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-ocean-900">{review.user}</h4>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Vérifié
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {review.attraction}
                      </span>
                    </div>

                    <h5 className="font-medium text-ocean-900 mb-2">{review.title}</h5>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {review.comment}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {review.date}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(review.id)}
                        className="flex items-center gap-1 hover:text-ocean-600"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {review.likes}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA pour voir plus et ajouter un avis */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/reviews">
            <Button variant="outline" className="border-ocean-500 text-ocean-600 hover:bg-ocean-50">
              Voir tous les avis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-cta">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ajouter mon avis
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <ReviewForm
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleNewReview}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
