
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sailboat, Camera, Wine, Utensils, Filter, Search, ArrowLeft, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import QuickLoginModal from "@/components/auth/QuickLoginModal";
import { apiService, BASE_URL } from "@/services/api";
import Footer from "@/components/Footer";

const ExperiencesPage = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [bookingLoading, setBookingLoading] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const getExperiences = async () => {
      try {
        const data = await apiService.getExperiences();
        setExperiences(data);
      } catch {

      }
    }
    getExperiences()
  }, [])


  const categories = ["all", "Maritime", "Culture", "Gastronomie", "Nature"];

  const filteredExperiences = experiences?.filter(experience => {
    const matchesCategory = selectedCategory === "all" || experience.category === selectedCategory;
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookNow = async (experienceId: number, experienceTitle: string) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setBookingLoading(experienceId);

    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Réservation initiée",
      description: `Votre demande de réservation pour "${experienceTitle}" a été envoyée. Vous recevrez une confirmation par email.`,
    });

    setBookingLoading(null);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    toast({
      title: "Connecté !",
      description: "Vous pouvez maintenant faire une réservation.",
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-sunset-50">
        <Navigation />

        <div className="">
          {/* Header */}
          <div className="bg-gradient-to-r from-sunset-600 to-sunset-500 text-white py-20">
            <div className="container mx-auto px-4">
              <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                Toutes les Expériences
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Vivez des moments inoubliables avec nos expériences authentiques et découvrez Idjwi sous un angle unique.
              </p>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher une expérience..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sunset-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-sunset-500 hover:bg-sunset-600" : ""}
                    >
                      {category === "all" ? "Toutes" : category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grille des expériences */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredExperiences.map((experience) => (
                <Card key={experience.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative overflow-hidden">
                      <img
                        src={`${BASE_URL}${experience.image}`}
                        alt={experience.title}
                        className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    <CardContent className="md:w-3/5 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="text-sunset-500 mr-3">
                            {experience.icon}
                          </div>
                          <h3 className="font-display text-xl font-semibold text-ocean-900">
                            {experience.title}
                          </h3>
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {experience.fullDescription}
                        </p>

                        <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {experience.participants}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {experience.location}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Durée: {experience.duration}
                          </div>
                          <div className="font-semibold text-sunset-600">
                            {experience.price}
                          </div>
                        </div>

                        <Button
                          className="w-full btn-cta"
                          onClick={() => handleBookNow(experience.id, experience.title)}
                          disabled={bookingLoading === experience.id}
                        >
                          {bookingLoading === experience.id ? "Réservation..." : !isAuthenticated ? "Se connecter et réserver" : "Réserver maintenant"}
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {filteredExperiences.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Aucune expérience trouvée pour votre recherche.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      <QuickLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        title="Connexion requise"
        description="Vous devez être connecté pour faire une réservation"
      />
    </>
  );
};

export default ExperiencesPage;
