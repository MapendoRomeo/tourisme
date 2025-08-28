import { useState, useEffect } from "react";
import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Users, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminStats from "./AdminStats";
import ReviewsManagement from "./ReviewsManagement";
import BookingsManagement from "./BookingsManagement";
import AttractionsSection from "../AttractionsSection";

interface AdminStats {
  users: number;
  reviews: number;
  attractions: number;
  bookings: number;
}

interface AdminReview {
  id: number;
  user: string;
  attraction: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: string;
}

interface AdminBooking {
  id: number;
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

interface AdminUser {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean;
}
interface Attraction {
  reviewsCount: number;
  attraction: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();

  const [stats, setStats] = useState<AdminStats>({ users: 0, reviews: 0, attractions: 0, bookings: 0 });
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [attractionss, setAttractionss] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, reviewsRes, bookingsRes, usersRes, attract, autoApp] = await Promise.all([
          axios.get("/stats"),
          axios.get("/reviews"),
          axios.get("/reservations"),
          axios.get("/users"),
          axios.get("/reviews/stats"),
          axios.get("/reviews/auto-approve")
        ]);
        setStats(statsRes.data);
        setReviews(reviewsRes.data);
        setBookings(bookingsRes.data);
        setUsers(usersRes.data);
        setAttractionss(attract.data.data);
        setEnabled(autoApp.data.autoApproveReviews);
      } catch {
        toast({ title: "Erreur", description: "Impossible de charger les données administrateur.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = () => {
    console.log("Déconnexion admin");
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
    // Simulate logout
    window.location.href = '/';
  };

  const handleUpdateReview = async (reviewId: number, status: 'approved' | 'rejected') => {
    try {
      await axios.patch(`/reviews/${reviewId}/status`, { status });
      const res = await axios.get("/reviews");
      setReviews(res.data);
      const statsRes = await axios.get("/stats");
      setStats(statsRes.data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour l'avis.", variant: "destructive" });
    }
  };

  const handleUpdateBooking = async (bookingId: number, status: 'confirmed' | 'cancelled') => {
    try {
      await axios.patch(`/reservations/${bookingId}/status`, { status });
      const res = await axios.get("/reservations");
      setBookings(res.data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour la réservation.", variant: "destructive" });
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await axios.delete(`/reviews/${reviewId}`);
      const res = await axios.get("/reviews");
      setReviews(res.data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer l'avis.", variant: "destructive" });
    }
  };

  const handleExportData = async () => {
    try {
      const res = await axios.get("/api/admin/export");
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'admin-data-export.json';
      a.click();
      toast({ title: "Export réussi", description: "Les données ont été exportées avec succès." });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'exporter les données.", variant: "destructive" });
    }
  };

  const toggleAutoApprove = async () => {
    try {
      const res = await axios.post("/reviews/auto-approve", { enabled: !enabled })
      setEnabled(res.data.autoApproveReviews)
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible update config", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-ocean-900">
                Administration VilleVoyage
              </h1>
              <p className="text-muted-foreground">Tableau de bord</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Voir le site
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <AdminStats stats={stats} />

        {/* Main Content */}
        {loading ? (
          <div className="text-center py-8">Chargement des données administrateur...</div>
        ) : (
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bookings">Réservations</TabsTrigger>
              <TabsTrigger value="reviews">Gestion des avis</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="attractions">Attractions</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <BookingsManagement
                bookings={bookings.map(b => ({
                  ...b,
                  status: ['confirmed', 'cancelled', 'pending', 'completed'].includes(b.status)
                    ? b.status as 'confirmed' | 'cancelled' | 'pending' | 'completed'
                    : 'pending'
                }))}
                onUpdateBooking={handleUpdateBooking}
              />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsManagement
                reviews={reviews.map(r => ({
                  ...r,
                  status: ['approved', 'rejected', 'pending'].includes(r.status)
                    ? r.status as 'approved' | 'rejected' | 'pending'
                    : 'pending'
                }))}
                onUpdateReview={handleUpdateReview}
                onDeleteReview={handleDeleteReview}
              />
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                  <CardDescription>
                    Liste des utilisateurs inscrits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-ocean-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${user.isAdmin ? 'bg-ocean-100 text-ocean-800' : 'bg-green-100 text-green-800'}`}>{user.isAdmin ? 'Admin' : 'Utilisateur'}</span>
                          <span className="text-sm text-muted-foreground">Actif</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attractions">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des attractions</CardTitle>
                  <CardDescription>
                    Ajoutez et modifiez les attractions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {attractionss?.map((attraction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded">
                        <div>
                          <p className="font-medium">{attraction.attraction}</p>
                          <p className="text-sm text-muted-foreground">
                            {attraction.reviewsCount} avis
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Modifier
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres système</CardTitle>
                  <CardDescription>
                    Configuration du système
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications email</p>
                        <p className="text-sm text-muted-foreground">Recevoir les notifications par email</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Activé
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Modération automatique</p>
                        <p className="text-sm text-muted-foreground">Approuver automatiquement les avis</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={toggleAutoApprove}
                      >
                        {enabled ? "Activé" : "Desactivé"}
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <Button onClick={handleExportData} className="w-full">
                        Exporter les données
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
