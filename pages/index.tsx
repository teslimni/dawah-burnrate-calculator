import Link from 'next/link'
import Image from 'next/image'
import { NextPage } from 'next'
import { Button } from '@/components/ui/button'

const Home: NextPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-green-50 px-4 py-16 flex flex-col items-center text-center">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 text-slate-900 text-left md:text-left">
            The Ummah Builder's Burn Rate Calculator
          </h1>
          <p className="max-w-xl text-lg text-slate-600 mb-8 text-left md:text-left">
            A smart monthly budget planner for Muslims dedicating their lives to Allah. Know your minimum financial
            need so you can focus on Dawah without drowning in bills.
          </p>

          <Link href="/signup">
            <Button size="lg" className="rounded-xl px-6 py-3">
              Get Started — It's Free
            </Button>
          </Link>
        </div>

        <div className="flex-1">
          <Image
            src="/images/burnrate-preview.png" // ⬅️ Replace with your own image later
            alt="Burn Rate Calculator Preview"
            width={480}
            height={480}
            className="rounded-xl shadow-md"
          />
        </div>
      </div>

      <div className="mt-12 text-sm text-slate-500">
        By using this tool, you accept our{' '}
        <Link href="/privacy" className="underline hover:text-slate-700">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link href="/terms" className="underline hover:text-slate-700">
          Terms of Service
        </Link>
        .
      </div>

      <footer className="mt-16 text-xs text-slate-400 flex flex-col items-center gap-2">
        <span>&copy; {new Date().getFullYear()} UmmahBuilders. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="underline hover:text-slate-600">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="/terms" className="underline hover:text-slate-600">
            Terms of Service
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default Home;
