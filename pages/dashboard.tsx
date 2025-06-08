import { useEffect, useState } from 'react';
import { withAuthPage } from '@/lib/withAuthPage';
import ProtectedLayout from '@/components/ProtectedLayout';
import Link from 'next/link';
import { User, Calculator, Cog, Users } from 'lucide-react';

const Dashboard = ({ user }: { user: { id: string; email: string } }) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasLoggedIn = localStorage.getItem('hasLoggedIn');
    const dismissed = localStorage.getItem('confirmationBannerDismissed');
    if (hasLoggedIn && !dismissed) {
      setShowBanner(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('confirmationBannerDismissed', 'true');
  };

  return (
    <ProtectedLayout user={user}>
      {showBanner && (
        <div className="relative mb-4 rounded border border-blue-300 bg-blue-100 px-4 py-3 text-blue-900">
          <p>Please check your email for a confirmation message.</p>
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 text-lg leading-none"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/profile"
          className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow hover:bg-slate-50 transition no-underline"
        >
          <User className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold">Profile</h3>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
        </Link>
        <Link
          href="/burn-rate-calculator"
          className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow hover:bg-slate-50 transition no-underline"
        >
          <Calculator className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold">Calculator</h3>
            <p className="text-sm text-muted-foreground">Plan your burn rate</p>
          </div>
        </Link>
        <Link
          href="/referrals"
          className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow hover:bg-slate-50 transition no-underline"
        >
          <Users className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold">Referrals</h3>
            <p className="text-sm text-muted-foreground">Invite your friends</p>
          </div>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow hover:bg-slate-50 transition no-underline"
        >
          <Cog className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold">Settings</h3>
            <p className="text-sm text-muted-foreground">Configure the app</p>
          </div>
        </Link>
      </div>
    </ProtectedLayout>
  );
};

export const getServerSideProps = withAuthPage(async (_ctx, user) => {
  return {
    props: { user },
  };
});

export default Dashboard;
