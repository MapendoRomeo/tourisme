import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sailboat, Camera, Wine, Utensils, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import QuickLoginModal from "@/components/auth/QuickLoginModal";
import { apiService, BASE_URL } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ExperiencesSection = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [bookingLoading, setBookingLoading] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingParticipants, setBookingParticipants] = useState(1);
  const [bookingTime, setBookingTime] = useState("");

  // Charger les expériences depuis l'API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await apiService.getExperiences();
        setExperiences(data);
      } catch {
        toast({
          title: "Erreur",
          description: "Impossible de charger les expériences.",
          variant: "destructive"
        });
      }
    };
    fetchExperiences();
  }, []);

  // Ouvre le modal de réservation
  const handleBookNow = (experience: any) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setSelectedExperience(experience);
    setBookingDate("");
    setBookingParticipants(1);
    setBookingTime("");
    setShowBookingModal(true);
  };

  // Validation et envoi de la réservation
  const handleConfirmBooking = async () => {
    if (!bookingDate || new Date(bookingDate) < new Date()) {
      toast({
        title: "Date invalide",
        description: "Veuillez choisir une date à venir.",
        variant: "destructive"
      });
      return;
    }
    if (!bookingTime) {
      toast({
        title: "Heure manquante",
        description: "Veuillez choisir une heure.",
        variant: "destructive"
      });
      return;
    }
    if (bookingParticipants < 1) {
      toast({
        title: "Nombre de participants invalide",
        description: "Veuillez choisir au moins 1 participant.",
        variant: "destructive"
      });
      return;
    }

    setBookingLoading(selectedExperience.id);
    // Appel API pour réserver
    try {
      await apiService.post("/bookings", {
        experience: selectedExperience.id,
        date: bookingDate,
        time: bookingTime,
        participants: bookingParticipants,
        price: selectedExperience.price * bookingParticipants,
        user: user?._id
      });
      toast({
        title: "Réservation initiée",
        description: `Votre demande de réservation pour "${selectedExperience.title}" a été envoyée.`,
      });
    } catch {
      toast({
        title: "Erreur",
        description: "La réservation a échoué.",
        variant: "destructive"
      });
    }

    setBookingLoading(null);
    setShowBookingModal(false);
    setSelectedExperience(null);
    setBookingTime("");
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
              Vivez Idjwi comme un local avec nos expériences uniques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((experience) => (
              <Card key={experience.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 relative overflow-hidden">
                    <img
                      src={`${BASE_URL}${experience.image}`}
                      alt={experience.title}
                      className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  <CardContent className="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="text-ocean-500 mr-3">
                          {/* Si tu as une icône dans l'API, sinon retire */}
                          {experience.icon || <Sailboat className="w-8 h-8" />}
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
            ))}
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

      {/* Modal de réservation */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réserver "{selectedExperience?.title}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Date de l'expérience</Label>
              <Input
                type="date"
                value={bookingDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setBookingDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Heure</Label>
              <Input
                type="time"
                value={bookingTime}
                onChange={e => setBookingTime(e.target.value)}
              />
            </div>
            <div>
              <Label>Nombre de participants</Label>
              <Input
                type="number"
                min={1}
                value={bookingParticipants}
                onChange={e => setBookingParticipants(Number(e.target.value))}
              />
            </div>
            <div className="font-semibold text-sunset-600">
              Prix total : {selectedExperience ? bookingParticipants * selectedExperience.price : 0} $
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleConfirmBooking}
              disabled={bookingLoading === selectedExperience?.id}
            >
              {bookingLoading === selectedExperience?.id ? "Réservation..." : "Confirmer la réservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
