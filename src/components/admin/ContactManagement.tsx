import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Mail, Phone, Calendar, MessageSquare, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'replied' | 'resolved' | 'spam';
  priority: 'low' | 'medium' | 'high';
}

interface ContactManagementProps {
  messages: ContactMessage[];
  onUpdateMessage: (id: string, status: ContactMessage['status']) => void;
  onSendReply: (messageId: string, replyText: string) => void;
}

const ContactManagement = ({
  messages,
  onUpdateMessage,
  onSendReply
}: ContactManagementProps) => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const { toast } = useToast();

  const handleUpdateStatus = (id: string, status: ContactMessage['status']) => {
    onUpdateMessage(id, status);
    toast({
      title: "Statut mis à jour",
      description: `Le message a été marqué comme ${status}`,
    });
  };

  const handleSendReply = (messageId: string) => {
    if (!replyText.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une réponse",
        variant: "destructive",
      });
      return;
    }
    onSendReply(messageId, replyText);
    setReplyText("");
    setSelectedMessage(null);
    toast({
      title: "Réponse envoyée",
      description: "Votre réponse a été envoyée avec succès",
    });
  };

  const getStatusBadge = (status: ContactMessage['status']) => {
    const variants = {
      pending: { variant: "secondary" as const, text: "En attente" },
      replied: { variant: "default" as const, text: "Répondu" },
      resolved: { variant: "default" as const, text: "Résolu" },
      spam: { variant: "destructive" as const, text: "Spam" },
    };

    const config = variants[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority: ContactMessage['priority']) => {
    const variants = {
      low: { variant: "secondary" as const, text: "Faible" },
      medium: { variant: "outline" as const, text: "Moyenne" },
      high: { variant: "destructive" as const, text: "Haute" },
    };

    const config = variants[priority];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const subjectLabels: Record<string, string> = {
    reservation: "Réservation",
    information: "Demande d'information",
    groupe: "Séjour de groupe",
    evenement: "Événement spécial",
    partenariat: "Partenariat",
    autre: "Autre"
  };

  const getSubjectLabel = (value: string) => subjectLabels[value] || value;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Gestion des Messages de Contact
          </CardTitle>
          <CardDescription>
            Gérez les messages reçus via le formulaire de contact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {message.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{message.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {message.email}
                        </div>
                        {message.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {message.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{getSubjectLabel(message.subject)}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {getSubjectLabel(message.subject)}
                      </p>
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(message.priority)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(message.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMessage(message)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Message de {message.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Email:</p>
                                  <p className="text-sm text-muted-foreground">{message.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Téléphone:</p>
                                  <p className="text-sm text-muted-foreground">{message.phone || 'Non fourni'}</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm font-medium mb-2">Sujet:</p>
                                <p className="text-sm">{message.subject}</p>
                              </div>

                              <div>
                                <p className="text-sm font-medium mb-2">Message:</p>
                                <div className="p-3 bg-muted rounded-md">
                                  <p className="text-sm">{message.message}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                  {getStatusBadge(message.status)}
                                  {getPriorityBadge(message.priority)}
                                </div>
                                <p className="text-sm text-muted-foreground">{message.date}</p>
                              </div>

                              {message.status !== 'replied' && message.status !== 'spam' && (
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium mb-2">Répondre:</p>
                                    <Textarea
                                      placeholder="Tapez votre réponse ici..."
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      rows={4}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleSendReply(message._id)}
                                      className="flex items-center gap-2"
                                    >
                                      <Mail className="w-4 h-4" />
                                      Envoyer la réponse
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => handleUpdateStatus(message._id, 'resolved')}
                                    >
                                      <Check className="w-4 h-4" />
                                      Marquer comme résolu
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(message._id, 'spam')}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun message de contact pour le moment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactManagement;