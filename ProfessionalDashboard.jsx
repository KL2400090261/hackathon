import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Calendar, Star, Users, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import type { Service } from '../../contexts/AppContext';

export function ProfessionalDashboard() {
  const { currentUser, professionals, bookings, reviews, addProfessional, updateProfessional, updateBooking } = useApp();
  const [profile, setProfile] = useState(professionals.find(p => p.userId === currentUser?.id));
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    title: profile?.title || '',
    bio: profile?.bio || '',
    hourlyRate: profile?.hourlyRate || 0,
    location: profile?.location || '',
    skills: profile?.skills.join(', ') || '',
    experience: profile?.experience || '',
    availability: profile?.availability || ''
  });

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: '',
    description: '',
    price: 0,
    duration: ''
  });

  useEffect(() => {
    const prof = professionals.find(p => p.userId === currentUser?.id);
    setProfile(prof);
    if (prof) {
      setProfileForm({
        title: prof.title,
        bio: prof.bio,
        hourlyRate: prof.hourlyRate,
        location: prof.location,
        skills: prof.skills.join(', '),
        experience: prof.experience,
        availability: prof.availability
      });
    }
  }, [professionals, currentUser]);

  const myBookings = bookings.filter(b => b.professionalId === profile?.id);
  const myReviews = reviews.filter(r => r.professionalId === profile?.id);

  const handleCreateProfile = () => {
    if (!currentUser) return;

    const newProfile = {
      userId: currentUser.id,
      name: currentUser.name,
      title: profileForm.title,
      bio: profileForm.bio,
      services: [],
      rating: 0,
      reviewCount: 0,
      hourlyRate: profileForm.hourlyRate,
      location: profileForm.location,
      skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      experience: profileForm.experience,
      availability: profileForm.availability
    };

    addProfessional(newProfile);
    toast.success('Professional profile created!');
    setIsEditingProfile(false);
  };

  const handleUpdateProfile = () => {
    if (!profile) return;

    updateProfessional(profile.id, {
      title: profileForm.title,
      bio: profileForm.bio,
      hourlyRate: profileForm.hourlyRate,
      location: profileForm.location,
      skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      experience: profileForm.experience,
      availability: profileForm.availability
    });

    toast.success('Profile updated successfully!');
    setIsEditingProfile(false);
  };

  const handleAddService = () => {
    if (!profile) return;

    const newService: Service = {
      id: `service_${Date.now()}`,
      ...serviceForm
    };

    updateProfessional(profile.id, {
      services: [...profile.services, newService]
    });

    toast.success('Service added successfully!');
    setIsAddingService(false);
    setServiceForm({
      name: '',
      category: '',
      description: '',
      price: 0,
      duration: ''
    });
  };

  const handleRemoveService = (serviceId: string) => {
    if (!profile) return;

    updateProfessional(profile.id, {
      services: profile.services.filter(s => s.id !== serviceId)
    });

    toast.success('Service removed');
  };

  const handleBookingAction = (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    updateBooking(bookingId, { status });
    toast.success(`Booking ${status}`);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Professional Profile</CardTitle>
              <CardDescription>Set up your profile to start offering services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Full Stack Developer"
                  value={profileForm.title}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell clients about yourself..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate">Hourly Rate ($)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={profileForm.hourlyRate}
                    onChange={(e) => setProfileForm({ ...profileForm, hourlyRate: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="React, Node.js, TypeScript"
                  value={profileForm.skills}
                  onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    placeholder="5 years"
                    value={profileForm.experience}
                    onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    placeholder="Mon-Fri, 9am-5pm"
                    value={profileForm.availability}
                    onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleCreateProfile} className="w-full">
                Create Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Professional Dashboard</h1>
          <p className="text-gray-600">Manage your services and bookings</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Bookings</CardDescription>
              <CardTitle className="text-3xl">{myBookings.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar className="size-8 text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Requests</CardDescription>
              <CardTitle className="text-3xl">
                {myBookings.filter(b => b.status === 'pending').length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Users className="size-8 text-yellow-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Rating</CardDescription>
              <CardTitle className="text-3xl">{profile.rating.toFixed(1)}</CardTitle>
            </CardHeader>
            <CardContent>
              <Star className="size-8 text-yellow-400 fill-yellow-400" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Reviews</CardDescription>
              <CardTitle className="text-3xl">{myReviews.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <Star className="size-8 text-purple-600" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            {myBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No bookings yet</p>
                </CardContent>
              </Card>
            ) : (
              myBookings.map(booking => {
                const service = profile.services.find(s => s.id === booking.serviceId);
                return (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{service?.name}</CardTitle>
                          <CardDescription>
                            {new Date(booking.date).toLocaleString()}
                          </CardDescription>
                          {booking.notes && (
                            <p className="text-sm text-gray-600 mt-2">Notes: {booking.notes}</p>
                          )}
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleBookingAction(booking.id, 'confirmed')}
                            >
                              <CheckCircle className="size-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBookingAction(booking.id, 'cancelled')}
                            >
                              <XCircle className="size-4 mr-2" />
                              Decline
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => handleBookingAction(booking.id, 'completed')}
                          >
                            <CheckCircle className="size-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Services</CardTitle>
                  <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="size-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>Create a new service offering</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="serviceName">Service Name</Label>
                          <Input
                            id="serviceName"
                            value={serviceForm.name}
                            onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={serviceForm.category}
                            onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={serviceForm.description}
                            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={serviceForm.price}
                              onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                              id="duration"
                              placeholder="1 hour"
                              value={serviceForm.duration}
                              onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddService} className="w-full">
                          Add Service
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.services.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No services added yet</p>
                ) : (
                  profile.services.map(service => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4>{service.name}</h4>
                            <Badge variant="outline">{service.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-gray-600">{service.duration}</span>
                            <span className="text-blue-600">${service.price}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveService(service.id)}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profile Information</CardTitle>
                  <Button onClick={() => setIsEditingProfile(!isEditingProfile)}>
                    {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingProfile ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="editTitle">Professional Title</Label>
                      <Input
                        id="editTitle"
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editBio">Bio</Label>
                      <Textarea
                        id="editBio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editRate">Hourly Rate ($)</Label>
                        <Input
                          id="editRate"
                          type="number"
                          value={profileForm.hourlyRate}
                          onChange={(e) => setProfileForm({ ...profileForm, hourlyRate: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editLocation">Location</Label>
                        <Input
                          id="editLocation"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editSkills">Skills (comma-separated)</Label>
                      <Input
                        id="editSkills"
                        value={profileForm.skills}
                        onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editExperience">Experience</Label>
                        <Input
                          id="editExperience"
                          value={profileForm.experience}
                          onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editAvailability">Availability</Label>
                        <Input
                          id="editAvailability"
                          value={profileForm.availability}
                          onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleUpdateProfile} className="w-full">
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-500">Title</Label>
                      <p>{profile.title}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Bio</Label>
                      <p>{profile.bio}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500">Hourly Rate</Label>
                        <p>${profile.hourlyRate}/hour</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Location</Label>
                        <p>{profile.location}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-500">Skills</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.skills.map(skill => (
                          <Badge key={skill}>{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500">Experience</Label>
                        <p>{profile.experience}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Availability</Label>
                        <p>{profile.availability}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {myReviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Star className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No reviews yet</p>
                </CardContent>
              </Card>
            ) : (
              myReviews.map(review => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-5 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
