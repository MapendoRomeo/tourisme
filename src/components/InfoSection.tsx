
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, Phone, Mail, Clock, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "@/api/axios";
import QuickLoginModal from "@/components/auth/QuickLoginModal";

const InfoSection = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isContacting, setIsContacting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const practicalInfo = [
    {
      icon: <Plane className="w-6 h-6" />,
      title: "Comment s'y rendre",
      info: "Aéroport de Nice à 1h30, TGV jusqu'à Saint-Raphaël puis bus"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Meilleure période",
      info: "Mai à octobre pour le climat, évitez juillet-août pour les foules"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Se déplacer",
      info: "À pied dans le centre, vélos disponibles, parking payant"
    },
    {
      icon: <Info className="w-6 h-6" />,
      title: "Bon à savoir",
      info: "Réservez restaurants et hébergements à l'avance en haute saison"
    }
  ];

  const handleContactNow = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setIsContacting(true);
    try {
      const res = await axios.post("/contact");
      toast({
        title: "Demande de contact envoyée",
        description: "Notre équipe vous contactera dans les plus brefs délais pour planifier votre séjour parfait à Saint-Tropez.",
      });
    } catch {
      toast({ title: "Erreur", description: "Impossible de contacter le serveur.", variant: "destructive" });
    }
    setIsContacting(false);
  };

  return (
    <>
      <section id="contact" className="section-padding bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Informations pratiques */}
            <div>
              <h2 className="section-title text-left text-ocean-900 mb-8">
                Informations Pratiques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {practicalInfo.map((item, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-ocean-500 group-hover:text-sunset-500 transition-colors duration-300">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-ocean-900 mb-2">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.info}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact et CTA */}
            <div className="lg:pl-8">
              <Card className="bg-gradient-hero text-white border-0 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <h3 className="font-display text-2xl font-bold mb-4">
                    Planifiez votre séjour parfait
                  </h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Notre équipe locale vous aide à créer un itinéraire sur mesure
                    pour découvrir tous les secrets de Saint-Tropez.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center space-x-3">
                      <Phone className="w-5 h-5" />
                      <span>+33 4 94 97 45 21</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <Mail className="w-5 h-5" />
                      <span>info@villevoyage-sttropez.fr</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-white text-ocean-600 hover:bg-white/90 font-semibold py-3"
                    onClick={handleContactNow}
                    disabled={isContacting}
                  >
                    {isContacting ? "Envoi en cours..." : "Contactez-nous maintenant"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <QuickLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Connexion requise"
        description="Vous devez être connecté pour envoyer une demande de contact."
      />
    </>
  );
};

export default InfoSection;
