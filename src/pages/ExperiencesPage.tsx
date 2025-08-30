
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sailboat, Camera, Wine, Utensils, Filter, Search, ArrowLeft, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import QuickLoginModal from "@/components/auth/QuickLoginModal";

const ExperiencesPage = () => {
    const { toast } = useToast();
    const { user, isAuthenticated } = useAuth();
    const [bookingLoading, setBookingLoading] = useState<number | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const experiences = [
        {
            id: 1,
            title: "Croisière au coucher du soleil",
            description: "Naviguez le long de la côte d'Azur et admirez un coucher de soleil inoubliable depuis la mer.",
            fullDescription: "Une expérience magique qui vous emmène découvrir la beauté de Saint-Tropez depuis la mer. Notre bateau vous conduira vers les plus beaux points de vue pour admirer le coucher de soleil sur la Méditerranée.",
            icon: <Sailboat className="w-8 h-8" />,
            price: "À partir de 85€",
            duration: "3 heures",
            category: "Maritime",
            participants: "2-12 personnes",
            location: "Port de Saint-Tropez",
            image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&h=400&fit=crop"
        },
        {
            id: 2,
            title: "Tour photographique",
            description: "Capturez les plus beaux sites avec un photographe professionnel local.",
            fullDescription: "Accompagné d'un photographe professionnel, découvrez les secrets de Saint-Tropez et repartez avec des souvenirs uniques. Apprenez les techniques de composition et capturez la lumière dorée de la Côte d'Azur.",
            icon: <Camera className="w-8 h-8" />,
            price: "À partir de 120€",
            duration: "2 heures",
            category: "Culture",
            participants: "1-6 personnes",
            location: "Centre-ville",
            image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop"
        },
        {
            id: 3,
            title: "Dégustation de vins",
            description: "Découvrez les vins rosés de Provence dans les vignobles environnants.",
            fullDescription: "Plongez dans l'univers des vins de Provence avec une dégustation guidée dans un domaine viticole authentique. Découvrez les secrets du rosé et dégustez les meilleurs crus de la région.",
            icon: <Wine className="w-8 h-8" />,
            price: "À partir de 65€",
            duration: "4 heures",
            category: "Gastronomie",
            participants: "4-15 personnes",
            location: "Vignobles de Gassin",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
        },
        {
            id: 4,
            title: "Cours de cuisine provençale",
            description: "Apprenez à cuisiner les spécialités locales avec un chef renommé.",
            fullDescription: "Initiez-vous aux saveurs de la Provence dans l'atelier d'un chef local. Apprenez à préparer des plats traditionnels avec des produits frais du marché et dégustez vos créations.",
            icon: <Utensils className="w-8 h-8" />,
            price: "À partir de 95€",
            duration: "3 heures",
            category: "Gastronomie",
            participants: "2-8 personnes",
            location: "Atelier culinaire",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
        },
        {
            id: 5,
            title: "Randonnée dans les vignes",
            description: "Explorez les sentiers viticoles avec une dégustation en plein air.",
            fullDescription: "Une randonnée unique à travers les vignobles avec des pauses dégustation dans des cadres exceptionnels. Découvrez la biodiversité locale et l'histoire viticole de la région.",
            icon: <MapPin className="w-8 h-8" />,
            price: "À partir de 75€",
            duration: "5 heures",
            category: "Nature",
            participants: "4-12 personnes",
            location: "Collines de Saint-Tropez",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
        },
        {
            id: 6,
            title: "Atelier de parfumerie",
            description: "Créez votre parfum personnalisé dans un atelier traditionnel.",
            fullDescription: "Découvrez l'art de la parfumerie française et créez votre fragrance unique. Un maître parfumeur vous guidera dans la composition de votre parfum personnalisé.",
            icon: <Utensils className="w-8 h-8" />,
            price: "À partir de 110€",
            duration: "2.5 heures",
            category: "Culture",
            participants: "1-8 personnes",
            location: "Atelier parfumerie",
            image: "https://images.unsplash.com/photo-1571104508999-893933ded431?w=600&h=400&fit=crop"
        }
    ];

    const categories = ["all", "Maritime", "Culture", "Gastronomie", "Nature"];

    const filteredExperiences = experiences.filter(experience => {
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

                <div className="pt-20">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sunset-600 to-sunset-500 text-white py-16">
                        <div className="container mx-auto px-4">
                            <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour à l'accueil
                            </Link>
                            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                                Toutes les Expériences
                            </h1>
                            <p className="text-xl text-white/90 max-w-2xl">
                                Vivez des moments inoubliables avec nos expériences authentiques et découvrez Saint-Tropez sous un angle unique.
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
                                                src={experience.image}
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
