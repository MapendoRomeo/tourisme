
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
import { Menu, BarChart3, MapPin, Camera, Building, Users, Calendar, Star, UserCog } from "lucide-react";

interface AdminMobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminMobileNav = ({ activeTab, onTabChange }: AdminMobileNavProps) => {
  const tabs = [
    { id: "stats", label: "Statistiques", icon: BarChart3 },
    { id: "users", label: "Utilisateurs", icon: UserCog },
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
          <Button variant="outline" className="w-full justify-start bg-white text-gray-900 border-gray-300 hover:bg-gray-50 shadow-sm">
            <Menu className="w-4 h-4 mr-2" />
            <span className="font-medium">Navigation Admin</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] bg-white border-r border-gray-200">
          <SheetHeader className="pb-6 border-b border-gray-100">
            <SheetTitle className="text-gray-900 text-xl font-bold">Administration</SheetTitle>
            <SheetDescription className="text-gray-600 text-sm">
              Sélectionnez une section à gérer
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-2 py-6">
            {tabs.map((tab) => (
              <SheetClose key={tab.id} asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-14 text-left rounded-lg transition-all duration-200 ${
                    activeTab === tab.id 
                      ? "bg-ocean-100 text-ocean-800 shadow-sm border border-ocean-200" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon className={`w-5 h-5 flex-shrink-0 ${
                      activeTab === tab.id ? "text-ocean-600" : "text-gray-500"
                    }`} />
                    <span className="font-medium text-base">{tab.label}</span>
                  </div>
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
