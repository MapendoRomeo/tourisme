
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShipIcon, MapPin, Phone, Mail, Clock, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InfoSection = () => {
  const navigate = useNavigate();

  const practicalInfo = [
    {
      icon: <ShipIcon className="w-6 h-6" />,
      title: "Comment s'y rendre",
      info: "Partez de Bukavu, Goma ou Kalehe, embarquez pour une traversée en pirogue motorisée vers l'ile d'Idjwi et admirez la beauté du lac Kivu en chemin"
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

  const handleContactNow = () => {
    navigate('/contact');
  };

  return (
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
                  pour découvrir tous les secrets de Idjwi.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center space-x-3">
                    <Phone className="w-5 h-5" />
                    <span>+243 97 47 91 666</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Mail className="w-5 h-5" />
                    <span>basemehabajuwe3@gmail.com</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-white text-ocean-600 hover:bg-white/90 font-semibold py-3"
                  onClick={handleContactNow}
                >
                  Contactez-nous maintenant
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
