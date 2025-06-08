import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextPage } from 'next';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

const Signup: NextPage = () => {
  const router = useRouter();
  const referralCode = typeof router.query.ref === 'string' ? router.query.ref : '';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gdprConsented, setGdprConsented] = useState(false);
  const [locationCity, setLocationCity] = useState('');
  const [locationCountry, setLocationCountry] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
              try {
                const res = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
                );
                const data = await res.json();
                setLocationCity(
                  data.address.city || data.address.town || data.address.village || ''
                );
                setLocationCountry(data.address.country || '');
              } catch {
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                setLocationCity(data.city || '');
                setLocationCountry(data.country_name || '');
              }
            },
            async () => {
              const res = await fetch('https://ipapi.co/json/');
              const data = await res.json();
              setLocationCity(data.city || '');
              setLocationCountry(data.country_name || '');
            }
          );
        } else {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          setLocationCity(data.city || '');
          setLocationCountry(data.country_name || '');
        }
      } catch {
        // ignore errors silently
      }
    };
    fetchLocation();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!gdprConsented) {
      setError('You must consent to our GDPR policy.');
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          gdprConsented,
          referralCode,
          location_city: locationCity,
          location_country: locationCountry,
        }),
      });


      if (!res.ok) throw new Error('Signup failed');
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDownloadUserData = async () => {
    try {
      const res = await fetch('/api/export-user-data');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my_dawahburnrate_data.json';
      a.click();
    } catch (err) {
      console.error('Data export failed', err);
    }
  };

  return (
    <div className="grid gap-6 p-6 max-w-md mx-auto min-h-screen bg-gradient-to-br from-white to-green-50 place-content-center">
      <h1 className="text-2xl font-bold text-center">Create an Account</h1>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <form onSubmit={handleSignup} className="space-y-3">
            <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            <div className="flex items-center gap-2">
              <Checkbox
                id="gdpr"
                checked={gdprConsented}
                onCheckedChange={(checked) => setGdprConsented(checked === true)}
              />
              <label htmlFor="gdpr" className="text-sm">
                I consent to the{' '}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="/terms" className="underline">
                  Terms of Service
                </Link>
              </label>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full mt-2">
              Sign Up
            </Button>
          </form>

          <Button variant="outline" className="w-full" onClick={handleDownloadUserData}>
            Download My Data
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline text-green-600 hover:text-green-700">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
