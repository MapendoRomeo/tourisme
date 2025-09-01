
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Wifi, Car, Waves, Coffee, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiService, BASE_URL } from '@/services/api';

const AccommodationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [accommodationType, setAccommodationType] = useState('all');
  const [accommodations, setAccommodations] = useState([])

  useEffect(() => {
    const fectAccommodations = async () => {
      try {
        const data = await apiService.getAccommodations()
        setAccommodations(data)
      } catch (err) {
        console.error(err)
      }
    }
    fectAccommodations()
  }, [])

  const amenityIcons = {
    "Wifi": <Wifi className="w-4 h-4" />,
    "Piscine": <Waves className="w-4 h-4" />,
    "Parking": <Car className="w-4 h-4" />,
    "Spa": <Coffee className="w-4 h-4" />
  };

  const filteredAccommodations = accommodations.filter(accommodation => {
    const matchesSearch = accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accommodation.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = priceRange === 'all' ||
      (priceRange === 'budget' && accommodation.price <= 100) ||
      (priceRange === 'mid' && accommodation.price > 100 && accommodation.price <= 300) ||
      (priceRange === 'luxury' && accommodation.price > 300);
    const matchesType = accommodationType === 'all' || accommodation.type.toLowerCase().includes(accommodationType);

    return matchesSearch && matchesPrice && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Hébergements à Idjwi
          </h1>
          <p className="font-script text-xl mb-8 text-white/90">
            Trouvez l'hébergement parfait pour votre séjour de rêve
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom ou localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Gamme de prix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les prix</SelectItem>
                  <SelectItem value="budget">Budget (≤ 100€)</SelectItem>
                  <SelectItem value="mid">Moyen (100-300€)</SelectItem>
                  <SelectItem value="luxury">Luxe (&gt; 300€)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={accommodationType} onValueChange={setAccommodationType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Type d'hébergement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="hôtel">Hôtels</SelectItem>
                  <SelectItem value="villa">Villas</SelectItem>
                  <SelectItem value="appartement">Appartements</SelectItem>
                  <SelectItem value="camping">Campings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodations Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAccommodations.map((accommodation) => (
              <Card key={accommodation.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={`${BASE_URL}${accommodation.image}`}
                    alt={accommodation.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <Badge className="absolute top-4 left-4 bg-white text-ocean-600">
                    {accommodation.type}
                  </Badge>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-sm font-semibold text-ocean-600">
                      {accommodation.price}€/nuit
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-xl font-semibold text-ocean-900 group-hover:text-sunset-600 transition-colors">
                      {accommodation.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{accommodation.rating}</span>
                      <span className="text-xs text-muted-foreground">({accommodation.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{accommodation.location}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {accommodation.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {accommodation.amenities.slice(0, 4).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenityIcons[amenity] || <Coffee className="w-3 h-3 mr-1" />}
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full btn-cta">
                    Réserver maintenant
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAccommodations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun hébergement ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AccommodationsPage;
