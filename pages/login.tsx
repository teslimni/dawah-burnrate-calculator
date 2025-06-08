import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextPage } from 'next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [locationCity, setLocationCity] = useState<string | null>(null);
  const [locationCountry, setLocationCountry] = useState<string | null>(null);

  const getFallbackLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('ipapi failed');
      const data = await res.json();
      setLocationCity(data.city ?? null);
      setLocationCountry(data.country_name ?? null);
    } catch {
      setLocationCity(null);
      setLocationCountry(null);
    }
  };

  const requestLocation = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        getFallbackLocation().then(() => resolve());
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
            );
            const data = await res.json();
            setLocationCity(
              data.address.city || data.address.town || data.address.village || null
            );
            setLocationCountry(data.address.country || null);
          } catch {
            await getFallbackLocation();
          }
          resolve();
        },
        async () => {
          await getFallbackLocation();
          resolve();
        },
        { timeout: 5000 }
      );
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestLocation();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          location_city: locationCity,
          location_country: locationCountry,
        }),
      });

      if (!res.ok) throw new Error('Invalid credentials');
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="grid gap-6 p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full mt-2">
              Log In
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Don’t have an account?{' '}
            <Link href="/signup" className="underline text-green-600 hover:text-green-700">
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
