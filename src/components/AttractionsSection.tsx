
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AttractionsSection = () => {
  const { toast } = useToast();

  const attractions = [
    {
      id: 1,
      name: "Vieux Port",
      description: "Le cœur historique de Saint-Tropez avec ses yachts luxueux et ses cafés emblématiques.",
      image: "https://images.unsplash.com/photo-1527004760525-7725fc034884?w=800&h=600&fit=crop",
      duration: "2-3h",
      rating: 4.8,
      category: "Historique",
      coordinates: { lat: 43.2677, lng: 6.6370 }
    },
    {
      id: 2,
      name: "Plage de Pampelonne",
      description: "5 km de sable fin et d'eaux cristallines, parfait pour se détendre au soleil.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      duration: "Journée",
      rating: 4.9,
      category: "Plage",
      coordinates: { lat: 43.2406, lng: 6.6814 }
    },
    {
      id: 3,
      name: "Citadelle de Saint-Tropez",
      description: "Forteresse du XVIIe siècle offrant une vue panoramique sur la baie.",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop",
      duration: "1-2h",
      rating: 4.6,
      category: "Culture",
      coordinates: { lat: 43.2741, lng: 6.6386 }
    },
    {
      id: 4,
      name: "Place des Lices",
      description: "Place animée avec son marché provençal et ses terrasses ombragées.",
      image: "https://images.unsplash.com/photo-1571104508999-893933ded431?w=800&h=600&fit=crop",
      duration: "1h",
      rating: 4.7,
      category: "Shopping",
      coordinates: { lat: 43.2679, lng: 6.6359 }
    }
  ];

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
                  src={attraction.image} 
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
                
                <div className="flex items-center justify-between text-sm">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AttractionsSection;
