
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, MapPin, CheckCircle } from "lucide-react";

interface AdminStatsProps {
  stats: {
    users: number;
    reviews: number;
    attractions: number;
    bookings: number;
  };
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  const statsData = [
    { title: "Utilisateurs", value: stats.users.toString(), icon: Users, change: "+12%" },
    { title: "Avis", value: stats.reviews.toString(), icon: Star, change: "+8%" },
    { title: "Attractions", value: stats.attractions.toString(), icon: MapPin, change: "+2%" },
    { title: "Réservations", value: stats.bookings.toString(), icon: CheckCircle, change: "+15%" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-ocean-900">{stat.value}</p>
                <p className="text-sm text-nature-600">{stat.change}</p>
              </div>
              <div className="p-3 bg-ocean-50 rounded-full">
                <stat.icon className="w-6 h-6 text-ocean-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
