
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Filter, Search, ArrowLeft, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { apiService, BASE_URL } from "@/services/api";
import Footer from "@/components/Footer";

const AttractionsPage = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
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


  const categories = ["all", "Historique", "Plage", "Culture", "Shopping", "Nature"];

  const filteredAttractions = attractions.filter(attraction => {
    const matchesCategory = selectedCategory === "all" || attraction.category === selectedCategory;
    const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleViewOnMap = (attraction: typeof attractions[0]) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${attraction.coordinates.lat},${attraction.coordinates.lng}`;
    window.open(url, '_blank');

    toast({
      title: "Carte ouverte",
      description: `Localisation de ${attraction.name} ouverte dans Google Maps`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-sunset-50">
      <Navigation />

      <div className="">
        {/* Header */}
        <div className="bg-gradient-to-r from-ocean-600 to-ocean-500 text-white py-20">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Toutes les Attractions
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Explorez tous les sites incontournables de Idjwi et découvrez la richesse de cette destination unique.
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
                placeholder="Rechercher une attraction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
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
                    className={selectedCategory === category ? "bg-ocean-500 hover:bg-ocean-600" : ""}
                  >
                    {category === "all" ? "Toutes" : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Grille des attractions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAttractions.map((attraction) => (
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

          {filteredAttractions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Aucune attraction trouvée pour votre recherche.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AttractionsPage;
