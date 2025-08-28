
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: number;
  user: string;
  attraction: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ReviewsManagementProps {
  reviews: Review[];
  onUpdateReview: (reviewId: number, status: 'approved' | 'rejected') => Promise<void>;
  onDeleteReview: (reviewId: number) => Promise<void>;
}

const ReviewsManagement = ({ reviews, onUpdateReview, onDeleteReview }: ReviewsManagementProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredReviews: Review[] = Array.isArray(reviews)
    ? (filter === 'all' ? reviews : reviews.filter(review => review.status === filter))
    : [];

  const handleApprove = async (reviewId: number) => {
    setLoading(true);
    try {
      await onUpdateReview(reviewId, 'approved');
      toast({ title: "Avis approuvé", description: "L'avis a été approuvé et sera visible publiquement." });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'approuver l'avis.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reviewId: number) => {
    setLoading(true);
    try {
      await onUpdateReview(reviewId, 'rejected');
      toast({ title: "Avis rejeté", description: "L'avis a été rejeté et ne sera pas visible publiquement.", variant: "destructive" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de rejeter l'avis.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    setLoading(true);
    try {
      await onDeleteReview(reviewId);
      toast({ title: "Avis supprimé", description: "L'avis a été définitivement supprimé.", variant: "destructive" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer l'avis.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des avis</CardTitle>
        <CardDescription>
          Gérez les avis des utilisateurs
        </CardDescription>

        {/* Filtres */}
        <div className="flex gap-2 mt-4">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'Tous' :
                status === 'pending' ? 'En attente' :
                  status === 'approved' ? 'Approuvés' : 'Rejetés'}
              <Badge variant="secondary" className="ml-1">
                {status === 'all' ? reviews.length : reviews.filter(r => r.status === status).length}
              </Badge>
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{review.user}</span>
                    <Badge
                      variant={
                        review.status === 'approved' ? 'default' :
                          review.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                    >
                      {review.status === 'approved' ? 'Approuvé' :
                        review.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      {review.attraction}
                    </span>
                  </div>
                  <h6 className="font-medium mb-1">{review.title}</h6>
                  <p className="text-sm mb-2">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  {review.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(review.id)}
                        className="bg-nature-500 hover:bg-nature-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(review.id)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Aucun avis trouvé pour ce filtre.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsManagement;
