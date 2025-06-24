
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Feil",
        description: "Vennligst fyll ut alle feltene",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(email, password);
      
      toast({
        title: "Innlogget",
        description: "Du er nå logget inn",
      });

      // Check for pending booking redirect
      const pendingBooking = sessionStorage.getItem('pending_booking');
      if (pendingBooking) {
        sessionStorage.removeItem('pending_booking');
        // Redirect back to booking completion
        navigate(-1);
      } else {
        // Redirect to intended destination or home
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }
    } catch (error) {
      toast({
        title: "Innlogging feilet",
        description: "Kontroller e-post og passord",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalHeader />
      <div className="flex-grow flex items-center justify-center py-8">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbake
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <LogIn className="h-6 w-6" />
                Logg inn
              </CardTitle>
              <p className="text-gray-600">
                Logg inn for å fullføre reservasjonen
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">E-post</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="din@email.no"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Passord</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ditt passord"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Logger inn...' : 'Logg inn'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <a href="#" className="text-blue-600 hover:underline">
                  Glemt passord?
                </a>
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                Har du ikke bruker?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal"
                  onClick={() => navigate('/login-selection')}
                >
                  Opprett konto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default LoginPage;
