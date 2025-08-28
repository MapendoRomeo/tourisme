
import { Button } from "@/components/ui/button";
import { Menu, X, User, Shield, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, loading, logout } = useAuth();

  const navItems = [
    { label: "Accueil", href: "/" },
    { label: "Attractions", href: "/#attractions" },
    { label: "Expériences", href: "/#experiences" },
    { label: "Hébergements", href: "/#hotels" },
    { label: "Avis", href: "/reviews" },
    { label: "Contact", href: "/#contact" }
  ];

  const isHomePage = location.pathname === "/";
  const handleLogout = () => {
    logout()
  };

  if (loading) return <p> chargement...</p>

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="font-display text-2xl font-bold text-white">
              Ville<span className="font-script text-sunset-200">Voyage</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="nav-link"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Déconnexion</span>
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <LogIn className="w-4 h-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
              )}
              <Button className="btn-cta">
                Réserver
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                {isAuthenticated ? (
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-white w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Déconnexion</span>
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-white w-full justify-start">
                      <LogIn className="w-4 h-4 mr-2" />
                      Connexion
                    </Button>
                  </Link>
                )}
                <Button className="btn-cta w-fit">
                  Réserver
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
