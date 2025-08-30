
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, BarChart3, MapPin, Camera, Building, Users, Calendar, Star } from "lucide-react";

interface AdminMobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminMobileNav = ({ activeTab, onTabChange }: AdminMobileNavProps) => {
  const tabs = [
    { id: "stats", label: "Statistiques", icon: BarChart3 },
    { id: "attractions", label: "Attractions", icon: MapPin },
    { id: "experiences", label: "Expériences", icon: Camera },
    { id: "accommodations", label: "Hébergements", icon: Building },
    { id: "team", label: "Équipe", icon: Users },
    { id: "bookings", label: "Réservations", icon: Calendar },
    { id: "reviews", label: "Avis", icon: Star },
  ];

  return (
    <div className="md:hidden mb-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full justify-start bg-white text-gray-900 border-gray-300 hover:bg-gray-50">
            <Menu className="w-4 h-4 mr-2" />
            Navigation Admin
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[350px] bg-white">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-gray-900 text-lg font-semibold">Menu Administration</SheetTitle>
            <SheetDescription className="text-gray-600">
              Sélectionnez une section à gérer
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-3 py-4">
            {tabs.map((tab) => (
              <SheetClose key={tab.id} asChild>
                <Button
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={`w-full justify-start h-12 text-left ${
                    activeTab === tab.id 
                      ? "bg-ocean-600 text-white hover:bg-ocean-700" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <tab.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </Button>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminMobileNav;
