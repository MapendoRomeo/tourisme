
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  attachments?: File[];
}

const ContactPage = () => {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  });

  const handleImageSelect = (file: File) => {
    const newAttachments = [...attachments, file];
    setAttachments(newAttachments);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const newPreviews = [...attachmentPreviews, e.target?.result as string];
      setAttachmentPreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    const newPreviews = attachmentPreviews.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    setAttachmentPreviews(newPreviews);
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Message envoyé avec succès !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    
    form.reset();
    setAttachments([]);
    setAttachmentPreviews([]);
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      info: "+33 4 94 97 45 21",
      detail: "Lun-Ven 9h-18h, Sam 9h-12h"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      info: "info@villevoyage-sttropez.fr",
      detail: "Réponse sous 24h"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adresse",
      info: "12 Rue de la Ponche, 83990 Saint-Tropez",
      detail: "Face au port de plaisance"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Horaires",
      info: "Lundi - Vendredi: 9h - 18h",
      detail: "Samedi: 9h - 12h"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Contactez-nous
          </h1>
          <p className="font-script text-xl mb-8 text-white/90">
            Notre équipe est là pour vous accompagner dans votre projet
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ocean-900 mb-6">
                    Informations de Contact
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Nous sommes là pour répondre à toutes vos questions et vous aider à planifier 
                    votre séjour parfait à Saint-Tropez.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="text-ocean-500 group-hover:text-sunset-500 transition-colors duration-300">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-ocean-900 mb-1">
                              {item.title}
                            </h4>
                            <p className="text-sm font-medium text-ocean-700 mb-1">
                              {item.info}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-6 h-6 text-ocean-500" />
                    <h2 className="font-display text-2xl font-bold text-ocean-900">
                      Envoyez-nous un message
                    </h2>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          rules={{ required: "Le nom est requis" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom complet *</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre nom" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          rules={{ 
                            required: "L'email est requis",
                            pattern: {
                              value: /^\S+@\S+$/,
                              message: "Email invalide"
                            }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="votre@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone</FormLabel>
                              <FormControl>
                                <Input placeholder="+33 6 12 34 56 78" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subject"
                          rules={{ required: "Le sujet est requis" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sujet *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un sujet" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="reservation">Réservation</SelectItem>
                                  <SelectItem value="information">Demande d'information</SelectItem>
                                  <SelectItem value="groupe">Séjour de groupe</SelectItem>
                                  <SelectItem value="evenement">Événement spécial</SelectItem>
                                  <SelectItem value="partenariat">Partenariat</SelectItem>
                                  <SelectItem value="autre">Autre</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        rules={{ 
                          required: "Le message est requis",
                          minLength: {
                            value: 10,
                            message: "Le message doit contenir au moins 10 caractères"
                          }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Décrivez votre demande en détail..."
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Image Upload Section */}
                      <div className="space-y-4">
                        <FormLabel>Pièces jointes (optionnel)</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Vous pouvez joindre des images pour illustrer votre demande
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {attachmentPreviews.map((preview, index) => (
                            <ImageUpload
                              key={index}
                              onImageSelect={() => {}}
                              onImageRemove={() => handleImageRemove(index)}
                              preview={preview}
                            />
                          ))}
                          
                          {attachments.length < 5 && (
                            <ImageUpload
                              onImageSelect={handleImageSelect}
                              onImageRemove={() => {}}
                            />
                          )}
                        </div>
                        
                        {attachments.length >= 5 && (
                          <p className="text-sm text-muted-foreground">
                            Maximum 5 images autorisées
                          </p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full btn-cta text-lg py-3"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Envoi en cours..."
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Envoyer le message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
