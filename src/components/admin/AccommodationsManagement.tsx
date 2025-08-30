
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";

interface Accommodation {
  id: number;
  name: string;
  description: string;
  location: string;
  type: string;
  price: number;
  image: string;
  rating: number;
  amenities: string[];
}

interface AccommodationsManagementProps {
  accommodations: Accommodation[];
  onAddAccommodation: (accommodation: Omit<Accommodation, 'id' | 'rating'>) => void;
  onUpdateAccommodation: (id: number, accommodation: Omit<Accommodation, 'id' | 'rating'>) => void;
  onDeleteAccommodation: (id: number) => void;
}

const AccommodationsManagement = ({ 
  accommodations, 
  onAddAccommodation, 
  onUpdateAccommodation, 
  onDeleteAccommodation 
}: AccommodationsManagementProps) => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    type: '',
    price: 0,
    image: '',
    amenities: [] as string[]
  });

  const types = ['Hôtel', 'Appartement', 'Maison d\'hôtes', 'Auberge', 'Résidence', 'Villa'];
  const availableAmenities = ['WiFi', 'Piscine', 'Parking', 'Climatisation', 'Restaurant', 'Spa', 'Salle de sport', 'Petit-déjeuner'];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      type: '',
      price: 0,
      image: '',
      amenities: []
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setFormData(prev => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.location || !formData.type || formData.price <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      onUpdateAccommodation(editingId, formData);
      setEditingId(null);
      toast({
        title: "Hébergement modifié",
        description: "L'hébergement a été mis à jour avec succès.",
      });
    } else {
      onAddAccommodation(formData);
      setIsAdding(false);
      toast({
        title: "Hébergement ajouté",
        description: "Le nouvel hébergement a été créé avec succès.",
      });
    }
    resetForm();
  };

  const handleEdit = (accommodation: Accommodation) => {
    setFormData({
      name: accommodation.name,
      description: accommodation.description,
      location: accommodation.location,
      type: accommodation.type,
      price: accommodation.price,
      image: accommodation.image,
      amenities: accommodation.amenities
    });
    setImagePreview(accommodation.image);
    setEditingId(accommodation.id);
    setIsAdding(false);
  };

  const handleDelete = (id: number) => {
    onDeleteAccommodation(id);
    toast({
      title: "Hébergement supprimé",
      description: "L'hébergement a été supprimé avec succès.",
      variant: "destructive"
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion des hébergements</CardTitle>
            <CardDescription>
              Ajoutez et modifiez les hébergements disponibles
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsAdding(true)} 
            className="flex items-center gap-2"
            disabled={isAdding || editingId !== null}
          >
            <Plus className="w-4 h-4" />
            Ajouter un hébergement
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire d'ajout/modification */}
        {(isAdding || editingId) && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-medium mb-4">
              {editingId ? 'Modifier l\'hébergement' : 'Nouvel hébergement'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom de l'hébergement"
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
                <Label htmlFor="type">Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Sélectionner un type</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="price">Prix par nuit (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="Prix par nuit"
                  min="0"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Image</Label>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  onImageRemove={handleImageRemove}
                  preview={imagePreview}
                  className="mt-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de l'hébergement"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Équipements</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {availableAmenities.map(amenity => (
                    <Button
                      key={amenity}
                      type="button"
                      variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAmenityToggle(amenity)}
                      className="justify-start"
                    >
                      {amenity}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
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

        {/* Liste des hébergements */}
        <div className="space-y-4">
          {accommodations.map((accommodation) => (
            <div key={accommodation.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex gap-4">
                <img 
                  src={accommodation.image} 
                  alt={accommodation.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h5 className="font-medium">{accommodation.name}</h5>
                    <span className="font-bold text-primary">{accommodation.price}€/nuit</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{accommodation.location}</p>
                  <Badge variant="outline" className="text-xs mb-2">
                    {accommodation.type}
                  </Badge>
                  <p className="text-sm mb-2 max-w-md">{accommodation.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {accommodation.amenities.slice(0, 3).map(amenity => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {accommodation.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{accommodation.amenities.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {accommodation.rating.toFixed(1)} ⭐
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleEdit(accommodation)}
                  disabled={isAdding || editingId !== null}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDelete(accommodation.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {accommodations.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Aucun hébergement pour le moment. Ajoutez-en un !
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AccommodationsManagement;
