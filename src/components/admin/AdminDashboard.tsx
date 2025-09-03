import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttractionsManagement from "@/components/admin/AttractionsManagement";
import AccommodationsManagement from "@/components/admin/AccommodationsManagement";
import TeamManagement from "@/components/admin/TeamManagement";
import ExperiencesManagement from "@/components/admin/ExperiencesManagement";
import BookingsManagement from "@/components/admin/BookingsManagement";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import ContactManagement from "@/components/admin/ContactManagement";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import { apiService, AdminReview, AdminUser, Attraction, Accommodation, ContactMessage } from '@/services/api';
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

interface AdminStats {
  users: number;
  monthlyRevenue: number;
  bookings: number;
}


interface AdminBooking {
  id: string;
  user: string;
  email: string;
  experience: string;
  date: string;
  time: string;
  participants: number;
  price: number;
  status: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("stats");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats>({ users: 0, monthlyRevenue: 0, bookings: 0 });
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([[]]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>();
  const [autoApproveReviews, setAutoApproveReviews] = useState<boolean>(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reviewsData, userData, attractionData, experienceData, accommodationData, teamMembersData, bookingsData, autoApproveData, contactData] = await Promise.all([
          apiService.getReviews(),
          apiService.getUsers(),
          apiService.getAttractions(),
          apiService.getExperiences(),
          apiService.getAccommodations(),
          apiService.getTemMembers(),
          apiService.getBookings(),
          apiService.getAutoApprove(),
          apiService.getContacts(),
        ]);
        setReviews(reviewsData);
        setUsers(userData);
        setAttractions(attractionData);
        setExperiences(experienceData);
        setAccommodations(accommodationData);
        setTeamMembers(teamMembersData);
        setBookings(bookingsData);
        setAutoApproveReviews(autoApproveData.autoApproveReviews)
        setContactMessages(contactData.success ? contactData.data : []);
      } catch {
        toast({ title: "Erreur", description: "Impossible de charger les données administrateur.", variant: "destructive" });
      }
    };
    fetchAll();
  }, []);



  function getLastMonthRevenue(bookings) {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthKey = lastMonth.toISOString().slice(0, 7);
    let total = 0;
    bookings.forEach(b => {
      if (b.status == 'confirmed' && b.date.startsWith(monthKey)) {
        total += b.price;
      }
    });
    return total;
  }
  const toggleAutoApprove = async () => {
    setAutoApproveReviews(!autoApproveReviews)
    try {
      const res = await apiService.updateAutoApprove(autoApproveReviews)
      setAutoApproveReviews(res.autoApproveReviews)
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible update config", variant: "destructive" });
    }
  }
  const handleAddAttraction = async (attraction: any) => {
    try {
      await apiService.createAttraction(attraction);
      const data = await apiService.getAttractions();
      setAttractions(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de crée l'attraction", variant: "destructive" });
    }
  };

  const handleUpdateAttraction = async (id: string, updatedAttraction: any) => {
    try {
      await apiService.updateAttraction(id, updatedAttraction);
      const data = await apiService.getAttractions();
      setAttractions(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour l'attraction", variant: "destructive" });
    }
  };

  const handleDeleteAttraction = async (id: string) => {
    try {
      await apiService.deleteAttraction(id);
      setAttractions(prev => prev.filter(attraction => attraction.id !== id));
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer l'attraction", variant: "destructive" });
    }
  };

  const handleAddAccommodation = async (accommodation: any) => {
    try {
      await apiService.createAccommodation(accommodation);
      const data = await apiService.getAccommodations();
      setAccommodations(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de crée l'hébergement", variant: "destructive" });
    }
  };

  const handleUpdateAccommodation = async (id: string, updatedAccommodation: any) => {
    try {
      await apiService.updateAccommodation(id, updatedAccommodation);
      const data = await apiService.getAccommodations();
      setAccommodations(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour l'hébergement", variant: "destructive" });
    }
  };

  const handleDeleteAccommodation = async (id: string) => {
    try {
      await apiService.deleteAccommodation(id);
      const data = await apiService.getAccommodations();
      setAccommodations(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer l'hébergement", variant: "destructive" });
    }
  };

  const handleAddTeamMember = async (member: any) => {
    try {
      await apiService.createTemMember(member);
      const data = await apiService.getTemMembers();
      setTeamMembers(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de créer le membre", variant: "destructive" });
    }
  };

  const handleUpdateTeamMember = async (id: string, updatedMember: any) => {
    try {
      // Supposons que apiService.updateTemMember existe
      await apiService.updateTemMember(id, updatedMember);
      const data = await apiService.getTemMembers();
      setTeamMembers(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le membre", variant: "destructive" });
    }
  };
  const handleDeleteTeamMember = async (id: string) => {
    try {
      await apiService.deleteTemMember(id);
      const data = await apiService.getTemMembers();
      setTeamMembers(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer le membre", variant: "destructive" });
    }
  };

  // Gestionnaires pour les expériences
  const handleAddExperience = async (experience: any) => {
    try {
      await apiService.createExperience(experience);
      const data = await apiService.getExperiences();
      setExperiences(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de crée l'expérience", variant: "destructive" });
    }
  };

  const handleUpdateExperience = async (id: string, updatedExperience: any) => {
    try {
      await apiService.updateExperience(id, updatedExperience);
      const data = await apiService.getExperiences();
      setExperiences(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour l'expérience", variant: "destructive" });
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await apiService.deleteExperience(id);
      const data = await apiService.getExperiences();
      setExperiences(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer l'expérience", variant: "destructive" });
    }
  };

  // Gestionnaires pour les réservations
  const handleUpdateBooking = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await apiService.updateBookingStatus(id, status);
      const data = await apiService.getBookings();
      setBookings(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour la réservation", variant: "destructive" });
    }
  };

  // Gestionnaires pour les avis
  const handleUpdateReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await apiService.updateReview(id, status)
      const data = await apiService.getReviews();
      setReviews(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour l'avis.", variant: "destructive" });
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await apiService.deleteReview(id);
      const data = await apiService.getReviews();
      setReviews(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour l'avis.", variant: "destructive" });
    }
  };

  // Gestionnaires pour les utilisateurs
  const handleUpdateUser = async (id: string, updatedUserRole: 'superAdmin' | 'admin' | 'user') => {
    try {
      await apiService.updateUserRole(id, updatedUserRole)
      const data = await apiService.getUsers()
      setUsers(data)
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le role", variant: "destructive" });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await apiService.deleteUser(id);
      const data = await apiService.getUsers();
      setUsers(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer l'utilisateur", variant: "destructive" });
    }
  };

  const handleUpdateStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      await apiService.patch(`/contacts/messages/${id}/status`, { status });
      toast({
        title: "Statut mis à jour",
        description: `Le message a été marqué comme ${status}`,
      });
      // Optionnel : recharge les messages ou mets à jour localement
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const handleSendReply = async (messageId: string, replyText: string) => {
    if (!replyText.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une réponse",
        variant: "destructive",
      });
      return;
    }
    try {
      await apiService.post(`/contacts/messages/${messageId}/reply`, { replyText: replyText });
      await handleUpdateStatus(messageId, 'replied');
      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été envoyée avec succès",
      });
      // Optionnel : recharge les messages ou mets à jour localement
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la réponse",
        variant: "destructive",
      });
    }
  };
  if (loading) <p className="">chargement des données...</p>
  if (!user?.isAdmin && !user?.isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-ocean-500 text-white hover:bg-ocean-600 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
          <p className="text-gray-600">Bienvenue {user.fullName}</p>
        </div>

        {/* Bouton retour accueil */}
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-ocean-500 text-white hover:bg-ocean-600 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Voir le site
        </Link>
      </div>

      {/* Navigation mobile */}
      <AdminMobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Navigation desktop - cachée sur mobile */}
        <TabsList className="hidden md:grid w-full grid-cols-9">
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="experiences">Expériences</TabsTrigger>
          <TabsTrigger value="accommodations">Hébergements</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total des réservations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenu mensuel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getLastMonthRevenue(bookings)} $</div>
              </CardContent>
            </Card>
          </div>

          {/* Section Paramètres des avis */}
          <div className="mt-8 flex flex-col items-center">
            <div className="mb-4 text-lg font-semibold text-ocean-900">Paramètres des avis</div>
            <div className="flex items-center gap-4">
              <Switch
                checked={autoApproveReviews}
                onCheckedChange={toggleAutoApprove}
                className={`data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500 transition-colors`}
                id="auto-approve-toggle"
              />
              <label htmlFor="auto-approve-toggle" className="font-medium text-gray-700">
                {autoApproveReviews ? "Auto-approbation activée" : "Auto-approbation désactivée"}
              </label>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Les nouveaux avis seront {autoApproveReviews ? "automatiquement approuvés." : "validés manuellement par un administrateur."}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UsersManagement
            users={users}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
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
          <ExperiencesManagement
            experiences={experiences}
            onAddExperience={handleAddExperience}
            onUpdateExperience={handleUpdateExperience}
            onDeleteExperience={handleDeleteExperience}
          />
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
          <BookingsManagement
            bookings={bookings}
            onUpdateBooking={handleUpdateBooking}
          />
        </TabsContent>
        <TabsContent value="contacts">
          <ContactManagement
            messages={contactMessages}
            onUpdateMessage={handleUpdateStatus}
            onSendReply={handleSendReply}
          />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsManagement
            reviews={reviews}
            onUpdateReview={handleUpdateReview}
            onDeleteReview={handleDeleteReview}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
