
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Filter, Search, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link } from "react-router-dom";

const AttractionsPage = () => {
    const { toast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const attractions = [
        {
            id: 1,
            name: "Vieux Port",
            description: "Le cœur historique de Saint-Tropez avec ses yachts luxueux et ses cafés emblématiques. Un lieu incontournable pour comprendre l'âme de la ville.",
            image: "https://images.unsplash.com/photo-1527004760525-7725fc034884?w=800&h=600&fit=crop",
            duration: "2-3h",
            rating: 4.8,
            category: "Historique",
            coordinates: { lat: 43.2677, lng: 6.6370 }
        },
        {
            id: 2,
            name: "Plage de Pampelonne",
            description: "5 km de sable fin et d'eaux cristallines, parfait pour se détendre au soleil. La plage la plus célèbre de Saint-Tropez.",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
            duration: "Journée",
            rating: 4.9,
            category: "Plage",
            coordinates: { lat: 43.2406, lng: 6.6814 }
        },
        {
            id: 3,
            name: "Citadelle de Saint-Tropez",
            description: "Forteresse du XVIIe siècle offrant une vue panoramique sur la baie. Musée maritime et histoire de la ville.",
            image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop",
            duration: "1-2h",
            rating: 4.6,
            category: "Culture",
            coordinates: { lat: 43.2741, lng: 6.6386 }
        },
        {
            id: 4,
            name: "Place des Lices",
            description: "Place animée avec son marché provençal et ses terrasses ombragées. Le lieu de vie des locaux.",
            image: "https://images.unsplash.com/photo-1571104508999-893933ded431?w=800&h=600&fit=crop",
            duration: "1h",
            rating: 4.7,
            category: "Shopping",
            coordinates: { lat: 43.2679, lng: 6.6359 }
        },
        {
            id: 5,
            name: "Musée de l'Annonciade",
            description: "Musée d'art moderne avec une collection exceptionnelle de peintures post-impressionnistes.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            duration: "1-2h",
            rating: 4.5,
            category: "Culture",
            coordinates: { lat: 43.2679, lng: 6.6372 }
        },
        {
            id: 6,
            name: "Sentier du Littoral",
            description: "Randonnée côtière avec des vues spectaculaires sur la Méditerranée et les criques sauvages.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
            duration: "2-4h",
            rating: 4.8,
            category: "Nature",
            coordinates: { lat: 43.2741, lng: 6.6450 }
        }
    ];

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

            <div className="pt-20">
                {/* Header */}
                <div className="bg-gradient-to-r from-ocean-600 to-ocean-500 text-white py-16">
                    <div className="container mx-auto px-4">
                        <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à l'accueil
                        </Link>
                        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                            Toutes les Attractions
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl">
                            Explorez tous les sites incontournables de Saint-Tropez et découvrez la richesse de cette destination unique.
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

export default AttractionsPage;
