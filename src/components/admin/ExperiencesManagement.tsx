import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { apiService, BASE_URL } from "@/services/api";

interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  maxParticipants: number;
  category: string;
  image: string;
  includes: string[];
}

interface ExperiencesManagementProps {
  experiences: Experience[];
  onAddExperience: (experience: Omit<Experience, 'id'>) => void;
  onUpdateExperience: (id: string, experience: Omit<Experience, 'id'>) => void;
  onDeleteExperience: (id: string) => void;
}

const ExperiencesManagement = ({
  experiences,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience
}: ExperiencesManagementProps) => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    duration: '',
    maxParticipants: 1,
    category: '',
    image: '',
    includes: ['']
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>(formData.image);

  const categories = ['Gastronomie', 'Culture', 'Nature', 'Sport', 'Détente', 'Aventure'];

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      duration: '',
      maxParticipants: 1,
      category: '',
      image: '',
      includes: ['']
    });
    setMainImageFile(null);
    setMainImagePreview('');
  };

  // Fonction d'upload
  const uploadImageToDb = async (file: File) => {
    const response = await apiService.uploadFile(file, '/images/upload');
    return response.data.imageUrl; // ou response.data.url selon ton backend
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.duration) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    let imageUrl = formData.image;
    if (mainImageFile) {
      imageUrl = await uploadImageToDb(mainImageFile);
    }

    const experienceData = {
      ...formData,
      image: imageUrl,
      includes: formData.includes.filter(item => item.trim() !== '')
    };

    if (editingId) {
      onUpdateExperience(editingId, experienceData);
      setEditingId(null);
      toast({
        title: "Expérience modifiée",
        description: "L'expérience a été mise à jour avec succès.",
      });
    } else {
      onAddExperience(experienceData);
      setIsAdding(false);
      toast({
        title: "Expérience ajoutée",
        description: "La nouvelle expérience a été créée avec succès.",
      });
    }
    resetForm();
  };

  const handleEdit = (experience: Experience) => {
    setFormData({
      title: experience.title,
      description: experience.description,
      price: experience.price,
      duration: experience.duration,
      maxParticipants: experience.maxParticipants,
      category: experience.category,
      image: experience.image,
      includes: experience.includes.length > 0 ? experience.includes : ['']
    });
    setEditingId(experience.id);
    setIsAdding(false);

    setMainImagePreview(`${BASE_URL}${experience.image}`);
    setMainImageFile(null);
  };

  const handleDelete = (id: string) => {
    onDeleteExperience(id);
    toast({
      title: "Expérience supprimée",
      description: "L'expérience a été supprimée avec succès.",
      variant: "destructive"
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const addIncludeField = () => {
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, '']
    }));
  };

  const removeIncludeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const updateIncludeField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.map((item, i) => i === index ? value : item)
    }));
  };

  const handleMainImageSelect = (file: File) => {
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleMainImageRemove = () => {
    setMainImageFile(null);
    setMainImagePreview("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion des expériences</CardTitle>
            <CardDescription>
              Ajoutez et modifiez les expériences proposées
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
            disabled={isAdding || editingId !== null}
          >
            <Plus className="w-4 h-4" />
            Ajouter une expérience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire d'ajout/modification */}
        {(isAdding || editingId) && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-medium mb-4">
              {editingId ? 'Modifier l\'expérience' : 'Nouvelle expérience'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de l'expérience"
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
                <Label htmlFor="price">Prix ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="Prix par personne"
                />
              </div>
              <div>
                <Label htmlFor="duration">Durée *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="ex: 3h, 1 journée, 2h30"
                />
              </div>
              <div>
                <Label htmlFor="maxParticipants">Participants max *</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 1 }))}
                  placeholder="Nombre maximum de participants"
                />
              </div>
              <div>
                <Label>Image principale</Label>
                <ImageUpload
                  preview={mainImagePreview}
                  onImageSelect={handleMainImageSelect}
                  onImageRemove={handleMainImageRemove}
                  className="mb-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description détaillée de l'expérience"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Ce qui est inclus</Label>
                <div className="space-y-2 mt-2">
                  {formData.includes.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateIncludeField(index, e.target.value)}
                        placeholder="ex: Dégustation de vins, Guide professionnel"
                      />
                      {formData.includes.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeIncludeField(index)}
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
                    onClick={addIncludeField}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un élément
                  </Button>
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

        {/* Liste des expériences */}
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div key={experience.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex gap-4">
                <img
                  src={`${BASE_URL}${experience.image}`}
                  alt={experience.title}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h5 className="font-medium">{experience.title}</h5>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="font-semibold text-ocean-600">{experience.price}$</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {experience.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Max {experience.maxParticipants}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs mb-2">
                    {experience.category}
                  </Badge>
                  <p className="text-sm max-w-md">{experience.description}</p>
                  {experience.includes.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Inclus: {experience.includes.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(experience)}
                  disabled={isAdding || editingId !== null}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(experience.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {experiences.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Aucune expérience pour le moment. Ajoutez-en une !
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperiencesManagement;
