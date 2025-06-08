import { withAuthPage } from '@/lib/withAuthPage';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import UserDropdown from '@/components/UserDropdown';
import { getUserFromRequest } from '@/lib/auth';
import ProtectedLayout from '@/components/ProtectedLayout';




const ProfilePage = ({ user }: { user: { id: string; email: string } }) => {
  return (
    <ProtectedLayout user={user}>
      <h2 className="text-xl font-bold mb-4">Welcome to your Dashboard</h2>
      <p>This is your private space to manage your Dawah burn rate and tools.</p>
    </ProtectedLayout>
  );
};


export const getServerSideProps = withAuthPage(async (_ctx, user) => {
  return {
    props: { user },
  };
});


export default ProfilePage;