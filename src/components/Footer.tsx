import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const navItems = [
    { label: "Accueil", href: "/" },
    { label: "Attractions", href: "/attractions" },
    { label: "Expériences", href: "/experiences" },
    { label: "Hébergements", href: "/accommodations" },
    { label: "Équipe", href: "/team" },
    { label: "Avis", href: "/reviews" },
    { label: "Contact", href: "/contact" }
];

export default function Footer() {
    return (
        <footer className="relative bg-ocean-900 text-white">
            {/* Wave en haut */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
                <svg
                    className="relative block w-[calc(100%+1.3px)] h-16"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    viewBox="0 0 1200 120"
                >
                    <path
                        d="M0,0V46.29c47.15,22,98.21,29.28,148,20,52.26-9.92,103.42-37.39,156-45.36C392.53,14,442.76,32.79,494,44.25c61.58,14.42,121.84,13.77,182,1.91,54.5-10.79,107.79-29.53,162-33.71,45.46-3.48,88.56,1.36,132,11.15,30.87,6.68,60.5,16.23,90,27.7V0Z"
                        className="fill-white/10"
                    ></path>
                </svg>
            </div>

            {/* Contenu du footer */}
            <div className="container mx-auto px-6 lg:px-20 py-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {/* Logo & À propos */}
                <div>
                    <h3 className="text-3xl font-bold mb-3 font-display">
                        Explorez<span className="text-sunset-400 font-script">Idjwi</span>
                    </h3>
                    <p className="text-white/70 text-sm">
                        Explorez Idjwi et vivez des expériences inoubliables avec ExplorezIdjwi.
                    </p>
                </div>

                {/* Liens dynamiques */}
                <div>
                    <h4 className="text-lg font-semibold mb-3">Liens rapides</h4>
                    <ul className="space-y-2 text-white/70 text-sm">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className="hover:text-sunset-400 transition-colors duration-300"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-lg font-semibold mb-3">Contact</h4>
                    <p className="flex gap-1 text-white/70 text-sm"><Mail size={18} />basemehabajuwe3@gmail.com</p>
                    <p className="flex gap-1 text-white/70 text-sm"><Phone size={18} />+243 97 47 91 666</p>
                    <p className="flex gap-1 text-white/70 text-sm"><MapPin size={18} />Idjwi, Sud-Kivu, RDC</p>
                </div>

                {/* Réseaux sociaux */}
                <div>
                    <h4 className="text-lg font-semibold mb-3">Suivez-nous</h4>
                    <div className="flex space-x-3 mt-2">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-sunset-400 hover:scale-110 transition-transform duration-300"
                            >
                                <Icon className="text-white hover:text-white" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/20 mt-8 pt-4 text-center text-sm text-white/50 relative z-10">
                © 2025 ExplorezIdjwi. Tous droits réservés.
            </div>
        </footer>
    );
}
