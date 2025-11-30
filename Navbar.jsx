import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { 
  User, 
  LogOut, 
  Briefcase, 
  Settings, 
  LayoutDashboard,
  Search,
  HeadphonesIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Navbar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardRoute = () => {
    if (!currentUser) return '/';
    switch (currentUser.role) {
      case 'admin':
        return '/admin';
      case 'professional':
        return '/professional';
      case 'support':
        return '/support';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="border-b bg-blue-500 sticky top-0 z-50" style={{ padding: '15px' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="size-6 text-white" />
              <span className="text-2xl text-white">Taskr</span>
            </Link>
            
            {currentUser && (
              <div className="hidden md:flex items-center gap-6">
                <Link to="/search" className="text-white hover:text-gray-200">
                  Find Professionals
                </Link>
                <Link to={getDashboardRoute()} className="text-white hover:text-gray-200">
                  Dashboard
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white">
                    <Avatar>
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback className="bg-blue-300">{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{currentUser.name}</span>
                      <span className="text-xs text-gray-500">{currentUser.email}</span>
                      <span className="text-xs text-blue-600 mt-1 capitalize">{currentUser.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(getDashboardRoute())}>
                    <LayoutDashboard className="mr-2 size-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  {currentUser.role === 'user' && (
                    <DropdownMenuItem onClick={() => navigate('/support/new')}>
                      <HeadphonesIcon className="mr-2 size-4" />
                      <span>Get Support</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white border border-white">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-white text-blue-500 hover:bg-gray-100">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
