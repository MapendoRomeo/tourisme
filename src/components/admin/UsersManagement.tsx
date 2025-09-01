
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserPlus, Edit, Trash2, Shield, ShieldAlert, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminUser } from '@/services/api';

interface UsersManagementProps {
  users: AdminUser[];
  onUpdateUser: (id: string, userRole: 'superAdmin' | 'admin' | 'user') => void;
  onDeleteUser: (id: string) => void;
}

const UsersManagement = ({ users, onUpdateUser, onDeleteUser }: UsersManagementProps) => {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [filter, setFilter] = useState<'all' | 'superAdmin' | 'admin' | 'user'>('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as AdminUser['role'],
    isActive: true
  });

  const filteredUsers = filter === 'all' ? users : users.filter(user => user.role === filter);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      isActive: true
    });
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    onUpdateUser(editingUser.id, formData.role);
    toast({
      title: "Utilisateur modifié",
      description: "L'utilisateur a été mis à jour avec succès.",
    });

    setEditingUser(null);
    resetForm();
  };

  const handleDeleteUser = (id: string) => {
    onDeleteUser(id);
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès.",
      variant: "destructive"
    });
  };

  const getRoleBadge = (role: string) => {
    const configs = {
      superAdmin: { variant: "destructive" as const, text: "Super Admin", icon: ShieldAlert },
      admin: { variant: "default" as const, text: "Admin", icon: Shield },
      user: { variant: "secondary" as const, text: "Utilisateur", icon: User }
    };

    const config = configs[role as keyof typeof configs];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestion des utilisateurs
            </CardTitle>
            <CardDescription>
              Gérez les utilisateurs et leurs permissions
            </CardDescription>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-ocean-50 rounded-lg">
            <div className="text-2xl font-bold text-ocean-600">{users.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-3 bg-nature-50 rounded-lg">
            <div className="text-2xl font-bold text-nature-600">
              {users.filter(u => u.role === 'admin' || u.role === 'superAdmin').length}
            </div>
            <div className="text-sm text-muted-foreground">Admins</div>
          </div>
          <div className="text-center p-3 bg-sunset-50 rounded-lg">
            <div className="text-2xl font-bold text-sunset-600">
              {users.filter(u => u.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground">Actifs</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {users.filter(u => !u.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground">Inactifs</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {(['all', 'superAdmin', 'admin', 'user'] as const).map((role) => (
            <Button
              key={role}
              variant={filter === role ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(role)}
            >
              {role === 'all' ? 'Tous' :
                role === 'superAdmin' ? 'Super Admins' :
                  role === 'admin' ? 'Admins' : 'Utilisateurs'}
              <Badge variant="secondary" className="ml-1">
                {role === 'all' ? users.length : users.filter(u => u.role === role).length}
              </Badge>
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {filteredUsers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucun utilisateur trouvé pour ce filtre.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date création</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>{user.lastLogin || 'Jamais'}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Modal d'édition */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nom complet</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Rôle</Label>
                <Select value={formData.role} onValueChange={(value: AdminUser['role']) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superAdmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdateUser}>
                  Modifier
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
