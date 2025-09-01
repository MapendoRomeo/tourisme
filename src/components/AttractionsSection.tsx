import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, ArrowRight, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { apiService, BASE_URL } from "@/services/api";

const AttractionsSection = () => {
  const { toast } = useToast();
  const [attractions, setAttractions] = useState([]);

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
      }
    };
    fetchAttractions();
  }, []);
  const handleViewOnMap = (attraction: typeof attractions[0]) => {
    // Open Google Maps with the attraction coordinates
    const url = `https://www.google.com/maps/search/?api=1&query=${attraction.coordinates.lat},${attraction.coordinates.lng}`;
    window.open(url, '_blank');

    toast({
      title: "Carte ouverte",
      description: `Localisation de ${attraction.name} ouverte dans Google Maps`,
    });
  };

  return (
    <section id="attractions" className="section-padding bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title text-ocean-900">
            Attractions Incontournables
          </h2>
          <p className="section-subtitle">
            Découvrez les joyaux qui font la renommée de Saint-Tropez
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {attractions.map((attraction) => (
            <Card key={attraction.id} className="attraction-card">
              <div className="relative overflow-hidden">
                <img
                  src={`${BASE_URL}${attraction.image}`}
                  alt={attraction.name}
                  className="attraction-image"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-sunset-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {attraction.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center bg-white/90 rounded-full px-2 py-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">{attraction.rating}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="font-display text-xl font-semibold mb-2 text-ocean-900">
                  {attraction.name}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {attraction.description}
                </p>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center text-ocean-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {attraction.duration}
                  </div>
                  <button
                    onClick={() => handleViewOnMap(attraction)}
                    className="flex items-center text-ocean-600 hover:text-sunset-500 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Voir sur la carte
                  </button>
                </div>

                <Link to={`/attractions/${attraction.id}`}>
                  <Button variant="outline" className="w-full text-ocean-600 border-ocean-200 hover:bg-ocean-50 hover:text-ocean-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir plus
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/attractions">
            <Button className="btn-cta">
              Voir toutes les attractions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AttractionsSection;
