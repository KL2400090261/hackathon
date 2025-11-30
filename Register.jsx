import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp, UserRole } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const { register } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(email, password, name, role);
    if (success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error('Email already exists');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md" style={{ border: '2px solid #3b82f6', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Briefcase className="size-12 text-blue-600" />
          </div>
          <CardTitle className="text-center" style={{ fontSize: '28px', color: '#1e40af' }}>Create an account</CardTitle>
          <CardDescription className="text-center">
            Join Taskr and start connecting with professionals
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" style={{ fontSize: '16px' }}>Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ border: '2px solid #ccc', padding: '10px' }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" style={{ fontSize: '16px' }}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ border: '2px solid #ccc', padding: '10px' }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" style={{ fontSize: '16px' }}>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ border: '2px solid #ccc', padding: '10px' }}
              />
            </div>
            <div className="space-y-2">
              <Label style={{ fontSize: '16px' }}>I want to:</Label>
              <RadioGroup value={role} onValueChange={(value : string) => setRole(value as UserRole)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user" className="cursor-pointer">
                    Hire professionals
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="professional" />
                  <Label htmlFor="professional" className="cursor-pointer">
                    Offer my services
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-blue-500 text-white" style={{ padding: '12px', fontSize: '16px' }}>
              Create Account
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
