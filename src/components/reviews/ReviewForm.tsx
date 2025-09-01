import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import QuickLoginModal from "@/components/auth/QuickLoginModal";
import { apiService } from "@/services/api";

interface ReviewFormProps {
  onClose?: () => void;
  onSubmit?: (review: any) => void;
}

const ReviewForm = ({ onClose, onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    attraction: "",
    title: "",
    comment: ""
  });
  const [attractions, setAttractions] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [attractionData] = await Promise.all([
          apiService.getAttractions(),
        ]);
        setAttractions(attractionData);
      } catch {
        toast({ title: "Erreur", description: "Impossible de charger les données administrateur.", variant: "destructive" });
      }
    };
    fetchAll();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (rating === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une note",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    

    const newReview = {
      id: Date.now(),
      user: formData.name || user?.fullName,
      avatar: (formData.name || user?.fullName)?.charAt(0).toUpperCase(),
      attraction: formData.attraction,
      rating,
      title: formData.title,
      comment: formData.comment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      verified: false,
      status: 'pending'
    };

    if (onSubmit) {
      onSubmit(newReview);
    }

    toast({
      title: "Avis soumis !",
      description: "Votre avis a été envoyé et sera publié après modération.",
    });

    // Reset form
    setFormData({
      name: user?.fullName || "",
      email: user?.email || "",
      attraction: "",
      title: "",
      comment: ""
    });
    setRating(0);
    setIsSubmitting(false);

    if (onClose) onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Remplir automatiquement les champs avec les données utilisateur
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName,
        email: user.email
      }));
    }
    toast({
      title: "Connecté !",
      description: "Vous pouvez maintenant soumettre votre avis.",
    });
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-ocean-900">
            Partagez votre expérience
          </CardTitle>
          <CardDescription>
            Votre avis nous aide à améliorer nos services et guide d'autres voyageurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting || (isAuthenticated && !!user?.fullName)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting || (isAuthenticated && !!user?.email)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attraction">Attraction visitée</Label>
              <Select
                value={formData.attraction}
                onValueChange={(value) => setFormData({ ...formData, attraction: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une attraction" />
                </SelectTrigger>
                <SelectContent>
                  {attractions.map((attraction) => (
                    <SelectItem key={attraction.id} value={attraction.id}>
                      {attraction.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Note</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-colors disabled:opacity-50"
                    onMouseEnter={() => !isSubmitting && setHoverRating(star)}
                    onMouseLeave={() => !isSubmitting && setHoverRating(0)}
                    onClick={() => !isSubmitting && setRating(star)}
                    disabled={isSubmitting}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating > 0 && `${rating}/5`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre de votre avis</Label>
              <Input
                id="title"
                name="title"
                placeholder="Résumez votre expérience"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Votre commentaire</Label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="Partagez les détails de votre expérience..."
                value={formData.comment}
                onChange={handleInputChange}
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="btn-cta flex-1"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Publication..." : !isAuthenticated ? "Se connecter et publier" : "Publier mon avis"}
              </Button>
              {onClose && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <QuickLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        title="Connexion requise"
        description="Vous devez être connecté pour publier un avis"
      />
    </>
  );
};

export default ReviewForm;
