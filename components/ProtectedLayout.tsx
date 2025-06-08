import { ReactNode } from 'react';
import UserDropdown from './UserDropdown';

type ProtectedLayoutProps = {
  user: { id: string; email: string };
  children: ReactNode;
};

const ProtectedLayout = ({ user, children }: ProtectedLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-green-100 to-green-200 shadow-sm border-b">
        <h1 className="text-lg font-semibold text-slate-700">
          Ummah Builder's Burn Rate App
        </h1>
        <UserDropdown email={user.email} />
      </header>

      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
};

export default ProtectedLayout;
