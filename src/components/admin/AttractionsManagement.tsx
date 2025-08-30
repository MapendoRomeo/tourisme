
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Attraction {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  location: string;
  category: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  duration: string;
  coordinates: { lat: number; lng: number };
  openingHours: string;
  price: string;
  highlights: string[];
  tips: string[];
}

interface AttractionsManagementProps {
  attractions: Attraction[];
  onAddAttraction: (attraction: Omit<Attraction, 'id' | 'rating' | 'reviewCount'>) => void;
  onUpdateAttraction: (id: number, attraction: Omit<Attraction, 'id' | 'rating' | 'reviewCount'>) => void;
  onDeleteAttraction: (id: number) => void;
}

const AttractionsManagement = ({ 
  attractions, 
  onAddAttraction, 
  onUpdateAttraction, 
  onDeleteAttraction 
}: AttractionsManagementProps) => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    location: '',
    category: '',
    image: '/placeholder.svg',
    gallery: [''],
    duration: '',
    coordinates: { lat: 43.2677, lng: 6.6370 },
    openingHours: '',
    price: '',
    highlights: [''],
    tips: ['']
  });

  const categories = ['Monument', 'Plage', 'Musée', 'Parc', 'Restaurant', 'Shopping', 'Historique'];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      longDescription: '',
      location: '',
      category: '',
      image: '/placeholder.svg',
      gallery: [''],
      duration: '',
      coordinates: { lat: 43.2677, lng: 6.6370 },
      openingHours: '',
      price: '',
      highlights: [''],
      tips: ['']
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.location || !formData.category) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    const processedData = {
      ...formData,
      gallery: formData.gallery.filter(url => url.trim() !== ''),
      highlights: formData.highlights.filter(highlight => highlight.trim() !== ''),
      tips: formData.tips.filter(tip => tip.trim() !== '')
    };

    if (editingId) {
      onUpdateAttraction(editingId, processedData);
      setEditingId(null);
      toast({
        title: "Attraction modifiée",
        description: "L'attraction a été mise à jour avec succès.",
      });
    } else {
      onAddAttraction(processedData);
      setIsAdding(false);
      toast({
        title: "Attraction ajoutée",
        description: "La nouvelle attraction a été créée avec succès.",
      });
    }
    resetForm();
  };

  const handleEdit = (attraction: Attraction) => {
    setFormData({
      name: attraction.name,
      description: attraction.description,
      longDescription: attraction.longDescription,
      location: attraction.location,
      category: attraction.category,
      image: attraction.image,
      gallery: attraction.gallery.length > 0 ? attraction.gallery : [''],
      duration: attraction.duration,
      coordinates: attraction.coordinates,
      openingHours: attraction.openingHours,
      price: attraction.price,
      highlights: attraction.highlights.length > 0 ? attraction.highlights : [''],
      tips: attraction.tips.length > 0 ? attraction.tips : ['']
    });
    setEditingId(attraction.id);
    setIsAdding(false);
  };

  const handleDelete = (id: number) => {
    onDeleteAttraction(id);
    toast({
      title: "Attraction supprimée",
      description: "L'attraction a été supprimée avec succès.",
      variant: "destructive"
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const updateArrayField = (field: 'gallery' | 'highlights' | 'tips', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'gallery' | 'highlights' | 'tips') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'gallery' | 'highlights' | 'tips', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion des attractions</CardTitle>
            <CardDescription>
              Ajoutez et modifiez les attractions touristiques
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsAdding(true)} 
            className="flex items-center gap-2"
            disabled={isAdding || editingId !== null}
          >
            <Plus className="w-4 h-4" />
            Ajouter une attraction
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire d'ajout/modification */}
        {(isAdding || editingId) && (
          <div className="border rounded-lg p-4 bg-muted/50 max-h-96 overflow-y-auto">
            <h4 className="font-medium mb-4">
              {editingId ? 'Modifier l\'attraction' : 'Nouvelle attraction'}
            </h4>
            <div className="space-y-4">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom de l'attraction"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localisation *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Adresse ou zone"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="duration">Durée</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="ex: 2-3h, Journée"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Prix</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="ex: Gratuit, 15€"
                  />
                </div>
                <div>
                  <Label htmlFor="openingHours">Horaires</Label>
                  <Input
                    id="openingHours"
                    value={formData.openingHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, openingHours: e.target.value }))}
                    placeholder="ex: 9h-18h, 24h/24"
                  />
                </div>
              </div>

              {/* Coordonnées */}
              <div>
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Coordonnées GPS
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    type="number"
                    step="any"
                    value={formData.coordinates.lat}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      coordinates: { ...prev.coordinates, lat: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="Latitude"
                  />
                  <Input
                    type="number"
                    step="any"
                    value={formData.coordinates.lng}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      coordinates: { ...prev.coordinates, lng: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="Longitude"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <Label htmlFor="image">Image principale</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="URL de l'image principale"
                />
              </div>

              {/* Galerie */}
              <div>
                <Label>Galerie d'images</Label>
                {formData.gallery.map((url, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={url}
                      onChange={(e) => updateArrayField('gallery', index, e.target.value)}
                      placeholder="URL de l'image"
                    />
                    {formData.gallery.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('gallery', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('gallery')}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une image
                </Button>
              </div>

              {/* Descriptions */}
              <div>
                <Label htmlFor="description">Description courte *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description courte pour les listes"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="longDescription">Description détaillée</Label>
                <Textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                  placeholder="Description complète pour la page de détails"
                  rows={4}
                />
              </div>

              {/* Points forts */}
              <div>
                <Label>Points forts</Label>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateArrayField('highlights', index, e.target.value)}
                      placeholder="Point fort"
                    />
                    {formData.highlights.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('highlights', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('highlights')}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un point fort
                </Button>
              </div>

              {/* Conseils */}
              <div>
                <Label>Conseils de visite</Label>
                {formData.tips.map((tip, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={tip}
                      onChange={(e) => updateArrayField('tips', index, e.target.value)}
                      placeholder="Conseil de visite"
                    />
                    {formData.tips.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('tips', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('tips')}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un conseil
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Liste des attractions */}
        <div className="space-y-4">
          {attractions.map((attraction) => (
            <div key={attraction.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex gap-4">
                <img 
                  src={attraction.image} 
                  alt={attraction.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h5 className="font-medium">{attraction.name}</h5>
                  <p className="text-sm text-muted-foreground mb-1">{attraction.location}</p>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {attraction.category}
                    </Badge>
                    {attraction.duration && (
                      <Badge variant="secondary" className="text-xs">
                        {attraction.duration}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm mt-2 max-w-md">{attraction.description}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {attraction.rating.toFixed(1)} ⭐ ({attraction.reviewCount} avis)
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleEdit(attraction)}
                  disabled={isAdding || editingId !== null}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDelete(attraction.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {attractions.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Aucune attraction pour le moment. Ajoutez-en une !
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AttractionsManagement;
