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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');
      if (!localStorage.getItem('hasLoggedIn')) {
        localStorage.setItem('hasLoggedIn', 'true');
      }
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="grid gap-6 p-6 max-w-md mx-auto min-h-screen bg-gradient-to-br from-white to-green-50 place-content-center">
      <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <form onSubmit={handleLogin} className="space-y-3">
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
            <Link href="/signup">Sign up here</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
