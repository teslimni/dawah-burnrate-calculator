import { NextPage } from 'next';
import Link from 'next/link';

const Terms: NextPage = () => {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p>
        The full terms of service will be published here. This placeholder outlines
        the basic conditions for using the application.
      </p>
      <p>
        Return to the <Link href="/">home page</Link>.
      </p>
    </main>
  );
};

export default Terms;
