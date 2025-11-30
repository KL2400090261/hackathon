import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Search, Star, MapPin, DollarSign, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function SearchProfessionals() {
  const { professionals } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    professionals.forEach(prof => {
      prof.services.forEach(service => cats.add(service.category));
    });
    return Array.from(cats);
  }, [professionals]);

  const filteredProfessionals = useMemo(() => {
    let filtered = professionals.filter(prof => {
      const matchesSearch = 
        prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = categoryFilter === 'all' || 
        prof.services.some(service => service.category === categoryFilter);

      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'price-high') return b.hourlyRate - a.hourlyRate;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return 0;
    });

    return filtered;
  }, [professionals, searchTerm, categoryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl mb-6" style={{ fontSize: '36px' }}>Find the Perfect Professional</h1>
          <div className="flex gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                placeholder="Search by name, title, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
                style={{ padding: '10px 10px 10px 40px', fontSize: '16px' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8" style={{ marginTop: '20px' }}>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-gray-600" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-gray-600 flex items-center ml-auto">
            {filteredProfessionals.length} professionals found
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filteredProfessionals.map(prof => (
            <Card key={prof.id} className="cursor-pointer" onClick={() => navigate(`/professional/${prof.id}`)} style={{ border: '2px solid #ddd', padding: '10px' }}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="size-16">
                    <AvatarImage src={prof.avatar} />
                    <AvatarFallback style={{ background: '#93c5fd' }}>{prof.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{prof.name}</CardTitle>
                    <CardDescription className="truncate">{prof.title}</CardDescription>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{prof.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({prof.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{prof.bio}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="size-4" />
                  <span>{prof.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm mb-4">
                  <DollarSign className="size-4 text-gray-600" />
                  <span className="text-gray-900" style={{ fontWeight: 'bold' }}>${prof.hourlyRate}/hour</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {prof.skills.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="secondary" style={{ background: '#bfdbfe', color: '#1e40af' }}>{skill}</Badge>
                  ))}
                  {prof.skills.length > 3 && (
                    <Badge variant="outline">+{prof.skills.length - 3}</Badge>
                  )}
                </div>

                <Button className="w-full bg-blue-500 text-white" onClick={() => navigate(`/professional/${prof.id}`)}>
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No professionals found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
