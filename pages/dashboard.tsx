import { withAuthPage } from '@/lib/withAuthPage';
import UserDropdown from '@/components/UserDropdown';
import ProtectedLayout from '@/components/ProtectedLayout';

const Dashboard = ({ user }: { user: { id: string; email: string } }) => {
  return (
    <ProtectedLayout user={user}>
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