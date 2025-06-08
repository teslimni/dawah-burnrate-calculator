import { useEffect, useState } from 'react';
import { withAuthPage } from '@/lib/withAuthPage';
import ProtectedLayout from '@/components/ProtectedLayout';

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
      <p>Burn rate data and dawah tools will appear here.</p>
    </ProtectedLayout>
  );
};

export const getServerSideProps = withAuthPage(async (_ctx, user) => {
  return {
    props: { user },
  };
});

export default Dashboard;