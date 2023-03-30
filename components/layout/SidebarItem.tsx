import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { IconType } from 'react-icons';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useLoginModal } from '../../hooks/useLoginModal';

interface SidebarItemProps {
  label: string;
  href?: string;
  icon: IconType;
  onClick?: () => void;
  auth?: boolean;
}

export const SidebarItem = ({
  label,
  href,
  icon: Icon,
  onClick,
  auth,
}: SidebarItemProps) => {
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();
  const loginModal = useLoginModal();

  const handleClick = useCallback(() => {
    if (onClick) {
      return onClick();
    }
    // If the user is not logged in, and they click on the sidebar item, open the login modal
    if (auth && !currentUser) {
      loginModal.onOpen();
    } else if (href) {
      router.push(href);
    }
  }, [auth, currentUser, href, loginModal, onClick, router]);

  return (
    <div onClick={handleClick} className='flex flex-row items-center'>
      <div className='relative rounded-full h-14 w-14 flex flex-center justify-center p-4 hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer lg:hidden'>
        <Icon size={26} color='white' />
      </div>
      <div className='relative hidden lg:flex items-row gap-4 p-4 rounded-full hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer items-center'>
        <Icon size={24} color='white' />
        <p className='hidden lg:block text-white text-xl'>{label}</p>
      </div>
    </div>
  );
};
