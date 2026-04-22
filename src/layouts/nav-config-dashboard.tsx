import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Utilisateurs',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Reclamations',
    path: '/reclamations',
    icon: icon('ic-blog'),
  },
  {
    title: 'Profil admin',
    path: '/profile',
    icon: icon('ic-lock'),
  },
];
