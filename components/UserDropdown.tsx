'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const UserDropdown = ({ email }: { email: string }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout');
    router.push('/login');
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md shadow hover:bg-slate-50">
        <span className="text-sm text-slate-700 font-medium">{email}</span>
        <ChevronDownIcon />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="mt-2 min-w-[180px] rounded-md bg-white p-2 shadow-xl border text-sm"
        align="end"
      >
        <DropdownMenu.Item className="py-2 px-3 hover:bg-slate-100 rounded-md">
          <Link href="/dashboard" className="text-primary">Dashboard</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item className="py-2 px-3 hover:bg-slate-100 rounded-md">
          <Link href="/burn-rate-calculator" className="text-primary">Calculator</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item className="py-2 px-3 hover:bg-slate-100 rounded-md">
          <Link href="/referrals" className="text-primary">Referrals</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item className="py-2 px-3 hover:bg-slate-100 rounded-md">
          <Link href="/profile" className="text-primary">Profile</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item className="py-2 px-3 hover:bg-slate-100 rounded-md">
          <Link href="/settings" className="text-primary">Settings</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-px bg-slate-200 my-2" />
        <DropdownMenu.Item
          onClick={handleLogout}
          className="py-2 px-3 hover:bg-red-50 text-red-600 rounded-md cursor-pointer"
        >
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default UserDropdown;
