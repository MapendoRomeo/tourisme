
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, User, MapPin, Euro, CheckCircle, XCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  user: string;
  email: string;
  experience: string;
  date: string;
  time: string;
  participants: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

interface BookingsManagementProps {
  bookings: Booking[];
  onUpdateBooking: (id: string, status: 'confirmed' | 'cancelled') => void;
}

const BookingsManagement = ({ bookings, onUpdateBooking }: BookingsManagementProps) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  const handleConfirm = (bookingId: string) => {
    onUpdateBooking(bookingId, 'confirmed');
    toast({
      title: "Réservation confirmée",
      description: "La réservation a été confirmée avec succès.",
    });
  };

  const handleCancel = (bookingId: string) => {
    onUpdateBooking(bookingId, 'cancelled');
    toast({
      title: "Réservation annulée",
      description: "La réservation a été annulée.",
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, text: "En attente" },
      confirmed: { variant: "default" as const, text: "Confirmée" },
      cancelled: { variant: "destructive" as const, text: "Annulée" },
      completed: { variant: "outline" as const, text: "Terminée" }
    };
    
    const config = variants[status as keyof typeof variants];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getTotalRevenue = () => {
    return filteredBookings
      .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
      .reduce((total, booking) => total + booking.price, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Gestion des réservations
        </CardTitle>
        <CardDescription>
          Gérez les réservations d'expériences
        </CardDescription>
        
        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-ocean-50 rounded-lg">
            <div className="text-2xl font-bold text-ocean-600">{bookings.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </div>
          <div className="text-center p-3 bg-nature-50 rounded-lg">
            <div className="text-2xl font-bold text-nature-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-sm text-muted-foreground">Confirmées</div>
          </div>
          <div className="text-center p-3 bg-sunset-50 rounded-lg">
            <div className="text-2xl font-bold text-sunset-600">{getTotalRevenue()}$</div>
            <div className="text-sm text-muted-foreground">Revenus</div>
          </div>
        </div>
        
        {/* Filtres */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {(['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'Toutes' : 
               status === 'pending' ? 'En attente' :
               status === 'confirmed' ? 'Confirmées' :
               status === 'cancelled' ? 'Annulées' : 'Terminées'}
              <Badge variant="secondary" className="ml-1">
                {status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length}
              </Badge>
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {filteredBookings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucune réservation trouvée pour ce filtre.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Expérience</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.user}</div>
                        <div className="text-sm text-muted-foreground">{booking.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {booking.experience}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.date}</div>
                        <div className="text-sm text-muted-foreground">{booking.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {booking.participants}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-medium">
                        <Euro className="w-4 h-4 text-muted-foreground" />
                        {booking.price}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleConfirm(booking.id)}
                              className="bg-nature-500 hover:bg-nature-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleCancel(booking.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingsManagement;
