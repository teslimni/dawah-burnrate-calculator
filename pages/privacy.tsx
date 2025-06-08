import { NextPage } from 'next';
import Link from 'next/link';

const Privacy: NextPage = () => {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p>
        This page will contain our full privacy policy. For now, it serves as a
        placeholder describing how user data is handled.
      </p>
      <p>
        Return to the{' '}
        <Link href="/" className="underline">
          home page
        </Link>
        .
      </p>
    </main>
  );
};

export default Privacy;
