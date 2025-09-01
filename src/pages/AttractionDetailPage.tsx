import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Star, ArrowLeft, Calendar, Users, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, BASE_URL } from "@/services/api";

const AttractionDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const data = await apiService.getAttractions();
        setAttractions(data);
      } catch {
        toast({
          title: "Erreur",
          description: "Impossible de charger les attractions.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAttractions();
  }, []);

  const attraction = attractions.find(a => a.id === id || "0");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-sunset-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Attraction non trouvée</h1>
            <Link to="/attractions">
              <Button>Retour aux attractions</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleViewOnMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${attraction.coordinates.lat},${attraction.coordinates.lng}`;
    window.open(url, '_blank');

    toast({
      title: "Carte ouverte",
      description: `Localisation de ${attraction.name} ouverte dans Google Maps`,
    });
  };

  const handleBooking = () => {
    toast({
      title: "Réservation",
      description: "Fonctionnalité de réservation à venir",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-sunset-50">
      <Navigation />

      <div className="pt-20">
        {/* Header avec image principale */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={`${BASE_URL}${attraction.image}`}
            alt={attraction.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-8 left-8">
            <Link to="/attractions" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux attractions
            </Link>
            <div className="flex items-center gap-4 mb-2">
              <span className="bg-sunset-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {attraction.category}
              </span>
              <div className="flex items-center bg-white/90 rounded-full px-3 py-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium ml-1">{attraction.rating}</span>
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-2">
              {attraction.name}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {attraction.description}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description détaillée */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="font-display text-2xl font-semibold mb-4 text-ocean-900">
                    À propos
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {attraction.longDescription}
                  </p>
                </CardContent>
              </Card>

              {/* Points forts */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="font-display text-2xl font-semibold mb-4 text-ocean-900">
                    Points forts
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {attraction.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-sunset-500 rounded-full mr-3 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Conseils */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="font-display text-2xl font-semibold mb-4 text-ocean-900">
                    Conseils de visite
                  </h2>
                  <ul className="space-y-3">
                    {attraction.tips.map((tip, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <div className="w-2 h-2 bg-ocean-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Galerie */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="font-display text-2xl font-semibold mb-4 text-ocean-900">
                    Galerie photos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {attraction.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={`${BASE_URL}${image}`}
                        alt={`${attraction.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar avec infos pratiques */}
            <div className="space-y-6">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-4 text-ocean-900">
                    Informations pratiques
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-ocean-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Durée</div>
                        <div className="text-gray-600">{attraction.duration}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-ocean-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Horaires</div>
                        <div className="text-gray-600">{attraction.openingHours}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-ocean-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Prix</div>
                        <div className="text-gray-600">{attraction.price}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={handleViewOnMap}
                      variant="outline"
                      className="w-full"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Voir sur la carte
                    </Button>

                    <Button
                      onClick={handleBooking}
                      className="w-full btn-cta"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Réserver une visite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ocean-900 text-white py-8 mt-16">
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

export default AttractionDetailPage;
