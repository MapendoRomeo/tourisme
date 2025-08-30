
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "@/api/axios";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import QuickLoginModal from "@/components/auth/QuickLoginModal";
import { Link } from "react-router-dom";

interface Experience {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
}

const ExperiencesSection = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [bookingLoading, setBookingLoading] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [nbPersonnes, setNbPersonnes] = useState(1);
  const [date, setDate] = useState("");

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: 1,
      title: "Croisière au coucher du soleil",
      description: "Naviguez le long de la côte d'Azur et admirez un coucher de soleil inoubliable.",
      price: "À partir de 85€",
      duration: "3 heures",
      image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Tour photographique",
      description: "Capturez les plus beaux sites avec un photographe professionnel local.",

      price: "À partir de 120€",
      duration: "2 heures",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Dégustation de vins",
      description: "Découvrez les vins rosés de Provence dans les vignobles environnants.",

      price: "À partir de 65€",
      duration: "4 heures",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Cours de cuisine provençale",
      description: "Apprenez à cuisiner les spécialités locales avec un chef renommé.",

      price: "À partir de 95€",
      duration: "3 heures",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
    }
  ]);
  const [loadingExp, setLoadingExp] = useState(false);

  // useEffect désactivé pour les données de test

  const handleBookNow = (experience: any) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setSelectedExperience(experience);
    setShowBookingModal(true);
    setNbPersonnes(1);
    setDate("");
  };

  const handleValidateBooking = async () => {
    setBookingLoading(selectedExperience.id);
    try {
      const res = await axios.post("/reservations", {
        experience: selectedExperience.title,
        time: selectedExperience.duration,
        participants: nbPersonnes,
        date,
        price: getTotalPrice()
      });
      toast({
        title: "Réservation validée",
        description: res.data.message || `Réservation pour ${nbPersonnes} personne(s) le ${date} à l'expérience "${selectedExperience.title}". Prix total: ${getTotalPrice()} €`,
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err?.response?.data?.message || "Erreur lors de la réservation.",
        variant: "destructive"
      });
    }
    setBookingLoading(null);
    setShowBookingModal(false);
    setSelectedExperience(null);
  };

  const getTotalPrice = () => {
    if (!selectedExperience) return 0;
    // Extraire le prix de l'expérience (ex: "À partir de 85€")
    const match = selectedExperience.price.match(/(\d+)/);
    const prixUnitaire = match ? parseInt(match[1], 10) : 0;
    return prixUnitaire * nbPersonnes;
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
      <section id="experiences" className="section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title text-ocean-900">
              Expériences Authentiques
            </h2>
            <p className="section-subtitle">
              Vivez Saint-Tropez comme un local avec nos expériences uniques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loadingExp ? (
              <div className="col-span-2 text-center py-8">Chargement des expériences...</div>
            ) : experiences.length === 0 ? (
              <div className="col-span-2 text-center py-8">Aucune expérience disponible.</div>
            ) : (
              experiences.map((experience) => (
                <Card key={experience.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 relative overflow-hidden">
                      <img
                        src={experience.image}
                        alt={experience.title}
                        className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <CardContent className="md:w-1/2 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="text-ocean-500 mr-3">
                          </div>
                          <h3 className="font-display text-xl font-semibold text-ocean-900">
                            {experience.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {experience.description}
                        </p>
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
                          onClick={() => handleBookNow(experience)}
                          disabled={bookingLoading === experience.id}
                        >
                          {bookingLoading === experience.id ? "Réservation..." : !isAuthenticated ? "Se connecter et réserver" : "Réserver maintenant"}
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Link to="/experiences">
              <Button className="btn-cta">
                Voir toutes les expériences
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal de réservation personnalisé */}
      {showBookingModal && selectedExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[320px]">
            <h3 className="text-lg font-bold mb-4">Réserver : {selectedExperience.title}</h3>
            <label className="block mb-2">
              Nombre de personnes :
              <input
                type="number"
                min={1}
                value={nbPersonnes}
                onChange={e => setNbPersonnes(Number(e.target.value))}
                className="border rounded px-2 py-1 w-full mt-1"
              />
            </label>
            <label className="block mb-2">
              Date de la visite :
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="border rounded px-2 py-1 w-full mt-1"
              />
            </label>
            <div className="mb-4">Prix total : <span className="font-semibold">{getTotalPrice()} €</span></div>
            <div className="flex gap-2">
              <Button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleValidateBooking}
                disabled={!date || bookingLoading === selectedExperience.id}
              >
                {bookingLoading === selectedExperience.id ? "Réservation..." : "Valider la réservation"}
              </Button>
              <Button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setShowBookingModal(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

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

export default ExperiencesSection;
