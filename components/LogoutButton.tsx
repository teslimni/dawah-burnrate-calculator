// components/LogoutButton.tsx
import { useRouter } from 'next/router';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout');
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="text-sm text-red-600 underline">
      Logout
    </button>
  );
};

export default LogoutButton;