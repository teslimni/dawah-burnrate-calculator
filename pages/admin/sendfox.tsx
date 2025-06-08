import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

const SendFoxAdmin = ({ failedUsers }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📨 SendFox Retry Admin</h1>
      {failedUsers.length === 0 ? (
        <p>No failed records. All good 🎉</p>
      ) : (
        <ul className="space-y-4">
          {failedUsers.map((user) => (
            <li key={user.id} className="p-4 border rounded bg-white shadow">
              <p><strong>{user.name}</strong> — {user.email}</p>
              <p className="text-red-600 text-sm">Error: {user.sendfoxError}</p>
              <form method="POST" action={`/api/admin/retry-sendfox`}>
                <input type="hidden" name="email" value={user.email} />
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Retry SendFox
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = getUserFromRequest(req);
  if (!user || user.email !== 'youremail@admin.com') {
    return { redirect: { destination: '/', permanent: false } };
  }

  const failedUsers = await prisma.user.findMany({
    where: { sendfoxStatus: 'failed' },
  });

  return {
    props: { failedUsers: JSON.parse(JSON.stringify(failedUsers)) },
  };
};

export default SendFoxAdmin;
