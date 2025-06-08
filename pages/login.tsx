import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextPage } from 'next';
import Head from 'next/head';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [recaptchaEnabled, setRecaptchaEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setRecaptchaEnabled(data.recaptchaEnabled))
      .catch(() => setRecaptchaEnabled(false))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const recaptchaToken = recaptchaEnabled
        ? (document.querySelector('textarea[name="g-recaptcha-response"]') as HTMLTextAreaElement)?.value || ''
        : ''
      if (recaptchaEnabled && !recaptchaToken) {
        setError('Please complete the CAPTCHA.')
        return
      }

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, recaptchaToken }),
      })

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
            {recaptchaEnabled && (
              <>
                <Head>
                  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
                </Head>
                <div className="g-recaptcha" data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}></div>
              </>
            )}

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
