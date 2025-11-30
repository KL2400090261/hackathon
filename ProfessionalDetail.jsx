import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Star, MapPin, IndianRupee, Briefcase, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function ProfessionalDetail() {
  const { id } = useParams<{ id: string }>();
  const { professionals, currentUser, addBooking, reviews } = useApp();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string>('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const professional = professionals.find(p => p.id === id);
  const professionalReviews = reviews.filter(r => r.professionalId === id);

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Professional not found</p>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!currentUser) {
      toast.error('Please login to book a service');
      navigate('/login');
      return;
    }

    if (!selectedService || !bookingDate) {
      toast.error('Please select a service and date');
      return;
    }

    addBooking({
      userId: currentUser.id,
      professionalId: professional.id,
      serviceId: selectedService,
      status: 'pending',
      date: bookingDate,
      notes: bookingNotes
    });

    toast.success('Booking request sent successfully!');
    setIsDialogOpen(false);
    setSelectedService('');
    setBookingDate('');
    setBookingNotes('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate('/search')} className="mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Search
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-6">
                  <Avatar className="size-24">
                    <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{professional.name}</CardTitle>
                    <CardDescription className="text-lg mb-4">{professional.title}</CardDescription>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="size-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg">{professional.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({professional.reviewCount} reviews)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {professional.skills.map(skill => (
                        <Badge key={skill}>{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-2">About</h3>
                  <p className="text-gray-600">{professional.bio}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="size-4" />
                    <span>{professional.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="size-4" />
                    <span>{professional.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="size-4" />
                    <span>{professional.availability}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="size-4 text-gray-600" />
                    <span>₹{professional.hourlyRate}/hour</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {professional.services.map(service => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4>{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <Badge variant="outline">{service.category}</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-600">{service.duration}</span>
                      <span className="text-blue-600">${service.price}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {professionalReviews.length > 0 ? (
                  professionalReviews.slice(0, 5).map(review => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No reviews yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book a Service</CardTitle>
                <CardDescription>Schedule a session with {professional.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book a Service</DialogTitle>
                      <DialogDescription>
                        Fill in the details to request a booking with {professional.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="service">Select Service</Label>
                        <select
                          id="service"
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="">Choose a service...</option>
                          {professional.services.map(service => (
                            <option key={service.id} value={service.id}>
                              {service.name} - ${service.price}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Date & Time</Label>
                        <Input
                          id="date"
                          type="datetime-local"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any specific requirements or questions..."
                          value={bookingNotes}
                          onChange={(e) => setBookingNotes(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleBooking} className="w-full">
                        Submit Booking Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
