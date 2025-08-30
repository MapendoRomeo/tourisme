import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AttractionsManagement from "@/components/admin/AttractionsManagement";
import AccommodationsManagement from "@/components/admin/AccommodationsManagement";
import TeamManagement from "@/components/admin/TeamManagement";
import AdminMobileNav from "@/components/admin/AdminMobileNav";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("stats");

  const [stats, setStats] = useState({
    totalUsers: 120,
    totalBookings: 350,
    monthlyRevenue: 15000,
  });

  const [attractions, setAttractions] = useState([
    {
      id: 1,
      name: "Vieux Port",
      description: "Le cœur historique de Saint-Tropez avec ses yachts luxueux et ses cafés emblématiques.",
      longDescription: "Le Vieux Port de Saint-Tropez est l'âme de la ville. Depuis des siècles, ce port de pêche authentique accueille les visiteurs dans une atmosphère unique mêlant tradition provençale et glamour international. Promenez-vous le long des quais pavés, admirez les yachts luxueux amarrés à quelques mètres des pointus traditionnels, et imprégnez-vous de l'ambiance si particulière de ce lieu mythique.",
      location: "Centre-ville",
      category: "Historique",
      image: "https://images.unsplash.com/photo-1527004760525-7725fc034884?w=800&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1527004760525-7725fc034884?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop"
      ],
      rating: 4.8,
      reviewCount: 1500,
      duration: "2-3h",
      coordinates: { lat: 43.2677, lng: 6.6370 },
      openingHours: "24h/24",
      price: "Gratuit",
      highlights: [
        "Architecture provençale authentique",
        "Yachts de luxe",
        "Cafés et restaurants emblématiques",
        "Marché aux poissons matinal"
      ],
      tips: [
        "Meilleure visite tôt le matin ou en fin d'après-midi",
        "Réservez votre table en terrasse à l'avance",
        "Parking payant en centre-ville"
      ]
    },
    {
      id: 2,
      name: "Plage de Pampelonne",
      description: "5 km de sable fin et d'eaux cristallines, parfait pour se détendre au soleil.",
      longDescription: "La plage de Pampelonne s'étend sur près de 5 kilomètres de sable fin doré, offrant l'une des plus belles étendues de la Côte d'Azur. Cette plage mythique, rendue célèbre par Brigitte Bardot dans les années 60, allie beauté naturelle et art de vivre à la française. Ses eaux cristallines d'un bleu azur contrastent magnifiquement avec le sable doré et la végétation méditerranéenne environnante.",
      location: "Ramatuelle",
      category: "Plage",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop"
      ],
      rating: 4.9,
      reviewCount: 1200,
      duration: "Journée",
      coordinates: { lat: 43.2406, lng: 6.6814 },
      openingHours: "Accessible 24h/24",
      price: "Gratuit (clubs de plage payants)",
      highlights: [
        "5 km de sable fin",
        "Eaux cristallines",
        "Clubs de plage renommés",
        "Sports nautiques"
      ],
      tips: [
        "Arrivez tôt pour les meilleures places",
        "Pensez à la crème solaire",
        "Restaurants de plage pour le déjeuner"
      ]
    }
  ]);

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Marie Dubois",
      role: "Directrice Générale",
      description: "Passionnée de voyages depuis plus de 15 ans, Marie dirige notre équipe avec expertise et bienveillance.",
      image: "/placeholder.svg",
      email: "marie.dubois@villevoyage.com",
      phone: "+33 1 23 45 67 89",
      linkedin: "https://linkedin.com/in/marie-dubois",
      twitter: "https://twitter.com/marie_dubois",
      github: ""
    },
    {
      id: 2,
      name: "Pierre Martin",
      role: "Guide Expert",
      description: "Spécialiste des circuits culturels et historiques, Pierre vous fera découvrir les secrets les mieux gardés de notre région.",
      image: "/placeholder.svg",
      email: "pierre.martin@villevoyage.com",
      phone: "+33 1 23 45 67 90",
      linkedin: "https://linkedin.com/in/pierre-martin",
      twitter: "",
      github: ""
    }
  ]);

  const [accommodations, setAccommodations] = useState([
    {
      id: 1,
      name: "Hôtel de la Plage",
      description: "Magnifique hôtel en bord de mer avec vue panoramique",
      location: "Bord de mer",
      type: "Hôtel",
      price: 150,
      image: "/placeholder.svg",
      rating: 4.5,
      amenities: ["WiFi", "Piscine", "Restaurant", "Spa"]
    },
    {
      id: 2,
      name: "Appartement Centre-ville",
      description: "Appartement moderne au cœur de la ville",
      location: "Centre-ville",
      type: "Appartement",
      price: 80,
      image: "/placeholder.svg",
      rating: 4.2,
      amenities: ["WiFi", "Climatisation", "Parking"]
    }
  ]);

  const handleAddAttraction = (attraction: any) => {
    const newAttraction = {
      ...attraction,
      id: attractions.length + 1,
      rating: 0,
      reviewCount: 0
    };
    setAttractions(prev => [...prev, newAttraction]);
  };

  const handleUpdateAttraction = (id: number, updatedAttraction: any) => {
    setAttractions(prev => prev.map(att =>
      att.id === id ? { ...att, ...updatedAttraction } : att
    ));
  };

  const handleDeleteAttraction = (id: number) => {
    setAttractions(prev => prev.filter(att => att.id !== id));
  };

  const handleAddAccommodation = (accommodation: any) => {
    const newAccommodation = {
      ...accommodation,
      id: accommodations.length + 1,
      rating: 0
    };
    setAccommodations(prev => [...prev, newAccommodation]);
  };

  const handleUpdateAccommodation = (id: number, updatedAccommodation: any) => {
    setAccommodations(prev => prev.map(acc =>
      acc.id === id ? { ...acc, ...updatedAccommodation } : acc
    ));
  };

  const handleDeleteAccommodation = (id: number) => {
    setAccommodations(prev => prev.filter(acc => acc.id !== id));
  };

  const handleAddTeamMember = (member: any) => {
    const newMember = {
      ...member,
      id: teamMembers.length + 1
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const handleUpdateTeamMember = (id: number, updatedMember: any) => {
    setTeamMembers(prev => prev.map(member =>
      member.id === id ? { ...member, ...updatedMember } : member
    ));
  };

  const handleDeleteTeamMember = (id: number) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  if (!user?.isAdmin || !user?.isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
        <p className="text-gray-600">Bienvenue {user.fullName}</p>
      </div>

      {/* Navigation mobile */}
      <AdminMobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Navigation desktop - cachée sur mobile */}
        <TabsList className="hidden md:grid w-full grid-cols-7">
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="experiences">Expériences</TabsTrigger>
          <TabsTrigger value="accommodations">Hébergements</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total des réservations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenu mensuel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.monthlyRevenue}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attractions">
          <AttractionsManagement
            attractions={attractions}
            onAddAttraction={handleAddAttraction}
            onUpdateAttraction={handleUpdateAttraction}
            onDeleteAttraction={handleDeleteAttraction}
          />
        </TabsContent>

        <TabsContent value="experiences">
          <div>
            <h2 className="text-2xl font-bold mb-4">Gestion des expériences</h2>
            <p>Ici, vous pourrez gérer les expériences offertes aux utilisateurs.</p>
          </div>
        </TabsContent>

        <TabsContent value="accommodations">
          <AccommodationsManagement
            accommodations={accommodations}
            onAddAccommodation={handleAddAccommodation}
            onUpdateAccommodation={handleUpdateAccommodation}
            onDeleteAccommodation={handleDeleteAccommodation}
          />
        </TabsContent>

        <TabsContent value="team">
          <TeamManagement
            members={teamMembers}
            onAddMember={handleAddTeamMember}
            onUpdateMember={handleUpdateTeamMember}
            onDeleteMember={handleDeleteTeamMember}
          />
        </TabsContent>

        <TabsContent value="bookings">
          <div>
            <h2 className="text-2xl font-bold mb-4">Gestion des réservations</h2>
            <p>Ici, vous pourrez gérer les réservations effectuées par les utilisateurs.</p>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div>
            <h2 className="text-2xl font-bold mb-4">Gestion des avis</h2>
            <p>Ici, vous pourrez gérer les avis laissés par les utilisateurs.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
