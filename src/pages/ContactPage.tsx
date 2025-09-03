
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
import Footer from '@/components/Footer';
import {apiService} from '@/services/api';

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

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await apiService.createContact(data);
      toast({
        title: "Message envoyé avec succès !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      form.reset();
      setIsSubmitting(false);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      info: "+243 97 47 91 666",
      detail: "Lun-Ven 9h-18h, Sam 9h-12h"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      info: "basemehabajuwe3@gmail.com",
      detail: "Réponse sous 24h"
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
                    votre séjour parfait à Idjwi.
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
      <Footer />
    </div>
  );
};

export default ContactPage;
