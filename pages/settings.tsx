import { withAuthPage } from '@/lib/withAuthPage';
import ProtectedLayout from '@/components/ProtectedLayout';

const SettingsPage = ({ user }: { user: { id: string; email: string } }) => {
  return (
    <ProtectedLayout user={user}>
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <p>Update your account preferences here.</p>
    </ProtectedLayout>
  );
};

export const getServerSideProps = withAuthPage(async (_ctx, user) => {
  return { props: { user } };
});

export default SettingsPage;
