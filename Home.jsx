import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Search, Briefcase, Shield, HeadphonesIcon, Star, ArrowRight, CheckCircle } from 'lucide-react';

export function Home() {
  const { currentUser, professionals } = useApp();
  const navigate = useNavigate();

  const topProfessionals = professionals.slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #e0f2fe, white)' }}>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16" style={{ marginTop: '40px' }}>
          <h1 className="text-5xl mb-6" style={{ color: '#2b459aff', fontWeight: 'bold' }}>
            Connect with Top Professionals
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find and hire skilled professionals for any service you need. 
            Browse profiles, compare rates, and book with confidence.
          </p>
          <div className="flex gap-4 justify-center" style={{ marginTop: '30px' }}>
            {currentUser ? (
              <Button size="lg" onClick={() => navigate('/search')} className="bg-blue-500 text-white" style={{ padding: '12px 24px' }}>
                Find Professionals
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate('/register')} className="bg-blue-500 text-white" style={{ padding: '12px 24px' }}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/search')} style={{ padding: '12px 24px' }}>
                  Browse Professionals
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20" style={{ marginTop: '60px' }}>
          <Card className="text-center" style={{ padding: '20px', border: '2px solid #ddd' }}>
            <CardHeader>
              <div className="mx-auto mb-4" style={{ width: '64px', height: '64px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search className="size-8 text-blue-600" />
              </div>
              <CardTitle>Easy Search</CardTitle>
              <CardDescription>
                Find professionals by service, location, or skills. Filter and sort to find your perfect match.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center" style={{ padding: '20px', border: '2px solid #ddd' }}>
            <CardHeader>
              <div className="mx-auto mb-4" style={{ width: '64px', height: '64px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <CardTitle>Verified Profiles</CardTitle>
              <CardDescription>
                All professionals are verified with ratings and reviews from real clients.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center" style={{ padding: '20px', border: '2px solid #ddd' }}>
            <CardHeader>
              <div className="mx-auto mb-4" style={{ width: '64px', height: '64px', background: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield className="size-8 text-purple-600" />
              </div>
              <CardTitle>Secure Booking</CardTitle>
              <CardDescription>
                Book services safely with our secure platform and get support when you need it.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Top Professionals */}
        <div className="mb-20">
          <h2 className="text-3xl text-center mb-10" style={{ color: '#1e40af' }}>Featured Professionals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {topProfessionals.map(prof => (
              <Card key={prof.id} className="cursor-pointer" onClick={() => navigate(`/professional/${prof.id}`)} style={{ border: '1px solid #ccc', padding: '15px' }}>
                <CardHeader>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="size-20 mb-4" style={{ border: '3px solid #25282dff' }}>
                      <AvatarImage src={prof.avatar} />
                      <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mb-2">{prof.name}</CardTitle>
                    <CardDescription>{prof.title}</CardDescription>
                    <div className="flex items-center gap-1 mt-3">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span>{prof.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({prof.reviewCount})</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {prof.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" style={{ background: '#e5e7eb', padding: '4px 8px' }}>{skill}</Badge>
                    ))}
                  </div>
                  <Button className="w-full bg-blue-500 text-white" onClick={() => navigate(`/professional/${prof.id}`)}>
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={() => navigate('/search')} style={{ padding: '10px 20px' }}>
              View All Professionals
            </Button>
          </div>
        </div>

        {/* For Professionals */}
        <div className="bg-blue-600 text-white rounded-2xl p-12 text-center" style={{ marginBottom: '40px' }}>
          <h2 className="text-3xl mb-4">Are you a professional?</h2>
          <p className="text-xl mb-8">
            Join our platform and connect with clients who need your expertise
          </p>
          <div className="flex gap-6 justify-center mb-8" style={{ flexWrap: 'wrap' }}>
            <div className="flex items-center gap-2">
              <Briefcase className="size-5" />
              <span>List your services</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="size-5" />
              <span>Build your reputation</span>
            </div>
            <div className="flex items-center gap-2">
              <HeadphonesIcon className="size-5" />
              <span>24/7 support</span>
            </div>
          </div>
          {currentUser ? (
            <Button size="lg" variant="secondary" onClick={() => navigate('/professional')} style={{ background: 'white', color: '#2563eb', padding: '12px 24px' }}>
              Go to Dashboard
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')} style={{ background: 'white', color: '#2563eb', padding: '12px 24px' }}>
              Join as Professional
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
