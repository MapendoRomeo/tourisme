
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Twitter, Github, Phone } from "lucide-react";

const TeamPage = () => {
    // Données de test pour les membres
    const teamMembers = [
        {
            id: 1,
            name: "Marie Dubois",
            role: "Directrice Générale",
            description: "Passionnée de voyages depuis plus de 15 ans, Marie dirige notre équipe avec expertise et bienveillance.",
            image: "/placeholder.svg",
            email: "marie.dubois@villevoyage.com",
            phone: "+33 1 23 45 67 89",
            linkedin: "https://linkedin.com/in/marie-dubois",
            twitter: "https://twitter.com/marie_dubois",
            github: null
        },
        {
            id: 2,
            name: "Pierre Martin",
            role: "Guide Expert",
            description: "Spécialiste des circuits culturels et historiques, Pierre vous fera découvrir les secrets les mieux gardés de notre région.",
            image: "/placeholder.svg",
            email: "pierre.martin@villevoyage.com",
            phone: "+33 1 23 45 67 90",
            linkedin: "https://linkedin.com/in/pierre-martin",
            twitter: null,
            github: null
        },
        {
            id: 3,
            name: "Sophie Leroy",
            role: "Responsable Hébergements",
            description: "Sophie s'occupe de sélectionner les meilleurs hébergements pour garantir votre confort lors de vos séjours.",
            image: "/placeholder.svg",
            email: "sophie.leroy@villevoyage.com",
            phone: "+33 1 23 45 67 91",
            linkedin: "https://linkedin.com/in/sophie-leroy",
            twitter: "https://twitter.com/sophie_leroy",
            github: null
        },
        {
            id: 4,
            name: "Thomas Chen",
            role: "Développeur Web",
            description: "Thomas développe et maintient notre plateforme pour vous offrir la meilleure expérience utilisateur.",
            image: "/placeholder.svg",
            email: "thomas.chen@villevoyage.com",
            phone: "+33 1 23 45 67 92",
            linkedin: "https://linkedin.com/in/thomas-chen",
            twitter: "https://twitter.com/thomas_chen",
            github: "https://github.com/thomas-chen"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-sunset-50 to-ocean-50">
            <Navigation />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-sunset-600 to-ocean-600 bg-clip-text text-transparent">
                        Notre Équipe
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Rencontrez les passionnés qui font de VilleVoyage une expérience unique.
                        Notre équipe d'experts est là pour vous accompagner dans tous vos projets de voyage.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {teamMembers.map((member) => (
                        <Card key={member.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <CardHeader className="text-center pb-4">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-sunset-200">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardTitle className="text-xl font-bold text-gray-800">
                                    {member.name}
                                </CardTitle>
                                <p className="text-sunset-600 font-medium">{member.role}</p>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {member.description}
                                </p>

                                <div className="space-y-2">
                                    {member.email && (
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Mail className="w-4 h-4 text-sunset-500" />
                                            <a
                                                href={`mailto:${member.email}`}
                                                className="text-gray-600 hover:text-sunset-600 transition-colors"
                                            >
                                                {member.email}
                                            </a>
                                        </div>
                                    )}

                                    {member.phone && (
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Phone className="w-4 h-4 text-sunset-500" />
                                            <a
                                                href={`tel:${member.phone}`}
                                                className="text-gray-600 hover:text-sunset-600 transition-colors"
                                            >
                                                {member.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-2 pt-2">
                                    {member.linkedin && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="p-2 hover:bg-sunset-100"
                                            asChild
                                        >
                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                                <Linkedin className="w-4 h-4 text-blue-600" />
                                            </a>
                                        </Button>
                                    )}

                                    {member.twitter && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="p-2 hover:bg-sunset-100"
                                            asChild
                                        >
                                            <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                                                <Twitter className="w-4 h-4 text-blue-400" />
                                            </a>
                                        </Button>
                                    )}

                                    {member.github && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="p-2 hover:bg-sunset-100"
                                            asChild
                                        >
                                            <a href={member.github} target="_blank" rel="noopener noreferrer">
                                                <Github className="w-4 h-4 text-gray-800" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        Rejoignez Notre Équipe
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Vous partagez notre passion pour les voyages ? Nous sommes toujours à la recherche de nouveaux talents.
                    </p>
                    <Button className="btn-cta">
                        Voir nos offres d'emploi
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TeamPage;
