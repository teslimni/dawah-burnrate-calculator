import { withAuthPage } from '@/lib/withAuthPage';
import { prisma } from '@/lib/prisma';
import ProtectedLayout from '@/components/ProtectedLayout';

const Referrals = ({ user, referralCode, count }: { user: { id: string; email: string }; referralCode: string; count: number }) => {
  return (
    <ProtectedLayout user={user}>
      <h2 className="text-xl font-bold mb-4">Referral Dashboard</h2>
      <p className="mb-2">Your referral code:</p>
      <code className="px-3 py-1 bg-slate-200 rounded-md font-mono">{referralCode}</code>
      <p className="mt-4">Sign-ups using your code: {count}</p>
    </ProtectedLayout>
  );
};

export const getServerSideProps = withAuthPage(async (_ctx, user) => {
  const referral = await prisma.referral.findUnique({ where: { userId: user.id } });
  const count = await prisma.referral.count({ where: { referredUserId: user.id } });

  return {
    props: {
      user,
      referralCode: referral?.referralCode || '',
      count,
    },
  };
});

export default Referrals;
