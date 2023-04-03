import { BsBellFill, BsHouseFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';

// Sidebar
import { SidebarLogo } from './SidebarLogo';
import { SidebarItem } from './SidebarItem';
import { SidebarTweetButton } from './SidebarTweetButton';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { signOut } from 'next-auth/react';

type SidebarItem = {
  label: string;
  href?: string;
  icon: any;
  auth?: boolean;
  alert?: boolean;
};

export const Sidebar = () => {
  const { data: currentUser } = useCurrentUser();

  const items: SidebarItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: BsHouseFill,
    },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: BsBellFill,
      auth: true,
      alert: currentUser?.hasNotification,
    },
    {
      label: 'Profile',
      href: `/users/${currentUser?.id}`,
      icon: FaUser,
      auth: true,
    },
  ];
  return (
    <div className='col-span-1 h-full pr-4 md:pr-6'>
      <div className='flex flex-col items-end'>
        <div className='space-y-2 lg:w-[230px]'>
          <SidebarLogo />
          {items.map((item) => {
            return (
              <SidebarItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                auth={item.auth}
                alert={item.alert!}
              />
            );
          })}
          {currentUser && (
            <SidebarItem
              onClick={() => signOut()}
              icon={BiLogOut}
              label='Logout'
              alert={false}
            />
          )}
          <SidebarTweetButton />
        </div>
      </div>
    </div>
  );
};
