import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { PlusCircle, Edit, Trash2, Mail, Phone, Linkedin, Twitter, Github } from "lucide-react";
import { toast } from "sonner";
import { apiService, BASE_URL } from "@/services/api";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  email: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface TeamManagementProps {
  members: TeamMember[];
  onAddMember: (member: Omit<TeamMember, 'id'>) => void;
  onUpdateMember: (id: string, member: Partial<TeamMember>) => void;
  onDeleteMember: (id: string) => void;
}

const TeamManagement = ({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember
}: TeamManagementProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    image: "",
    email: "",
    phone: "",
    linkedin: "",
    twitter: "",
    github: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      description: "",
      image: "",
      email: "",
      phone: "",
      linkedin: "",
      twitter: "",
      github: ""
    });
    setImagePreview("");
  };

  // Fonction d'upload
  const uploadImageToDb = async (file: File) => {
    const response = await apiService.uploadFile(file, '/images/upload');
    return response.data.imageUrl; // ou response.data.url selon ton backend
  };

  // Sélection et suppression
  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview("");
  };

  // Ajout d'un membre
  const handleAddMember = async () => {
    if (!formData.name || !formData.role || !formData.email) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    let imageUrl = formData.image;
    if (imageFile) {
      imageUrl = await uploadImageToDb(imageFile);
    }

    onAddMember({
      ...formData,
      image: imageUrl || "/placeholder.svg"
    });

    toast.success("Membre ajouté avec succès");
    resetForm();
    setIsAddModalOpen(false);
    setImageFile(null);
    setImagePreview("");
  };

  // Edition d'un membre
  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description,
      image: member.image,
      email: member.email,
      phone: member.phone || "",
      linkedin: member.linkedin || "",
      twitter: member.twitter || "",
      github: member.github || ""
    });
    setImagePreview(`${BASE_URL}${member.image}`);
    setImageFile(null);
    setIsEditModalOpen(true);
  };

  // Mise à jour d'un membre
  const handleUpdateMember = async () => {
    if (!formData.name || !formData.role || !formData.email || !editingMember) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    let imageUrl = formData.image;
    if (imageFile) {
      imageUrl = await uploadImageToDb(imageFile);
    }

    onUpdateMember(editingMember.id, {
      ...formData,
      image: imageUrl || "/placeholder.svg"
    });

    toast.success("Membre modifié avec succès");
    resetForm();
    setIsEditModalOpen(false);
    setEditingMember(null);
    setImageFile(null);
    setImagePreview("");
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      onDeleteMember(id);
      toast.success("Membre supprimé avec succès");
    }
  };

  const roles = [
    "Directeur/Directrice",
    "Guide Expert",
    "Responsable Hébergements",
    "Responsable Expériences",
    "Développeur Web",
    "Marketing",
    "Service Client",
    "Comptabilité",
    "Autre"
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion de l'équipe</h2>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Ajouter un membre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau membre</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Marie Dupont"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Rôle *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="marie.dupont@villevoyage.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Photo de profil</Label>
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    onImageRemove={handleImageRemove}
                    preview={imagePreview}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/in/marie-dupont"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                    placeholder="https://twitter.com/marie_dupont"
                  />
                </div>

                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="https://github.com/marie-dupont"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez brièvement le parcours et les compétences du membre..."
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddMember}>
                  Ajouter le membre
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={`${BASE_URL}${member.image}`}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-sunset-600">{member.role}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditMember(member)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600 line-clamp-2">{member.description}</p>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center space-x-2 text-xs">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">{member.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-1">
                {member.linkedin && (
                  <Button variant="ghost" size="sm" className="p-1">
                    <Linkedin className="w-3 h-3 text-blue-600" />
                  </Button>
                )}
                {member.twitter && (
                  <Button variant="ghost" size="sm" className="p-1">
                    <Twitter className="w-3 h-3 text-blue-400" />
                  </Button>
                )}
                {member.github && (
                  <Button variant="ghost" size="sm" className="p-1">
                    <Github className="w-3 h-3 text-gray-800" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal d'édition */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le membre</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nom complet *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Marie Dupont"
                />
              </div>

              <div>
                <Label htmlFor="edit-role">Rôle *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="marie.dupont@villevoyage.com"
                />
              </div>

              <div>
                <Label htmlFor="edit-phone">Téléphone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Photo de profil</Label>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  onImageRemove={handleImageRemove}
                  preview={imagePreview}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="edit-linkedin">LinkedIn</Label>
                <Input
                  id="edit-linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/marie-dupont"
                />
              </div>

              <div>
                <Label htmlFor="edit-twitter">Twitter</Label>
                <Input
                  id="edit-twitter"
                  value={formData.twitter}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                  placeholder="https://twitter.com/marie_dupont"
                />
              </div>

              <div>
                <Label htmlFor="edit-github">GitHub</Label>
                <Input
                  id="edit-github"
                  value={formData.github}
                  onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/marie-dupont"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez brièvement le parcours et les compétences du membre..."
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateMember}>
                Modifier le membre
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
