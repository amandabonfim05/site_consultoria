import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import styles from './AppLayout.module.css';
import logo from '../../assets/logo.svg';
import { logout } from '../../services/auth';

const NAV_ITEMS = [
  { label: 'Dashbord', to: '/dashboard' },
  { label: 'Contatos', to: '/contatos' },
  { label: 'Contratos', to: '/contratos' },
  { label: 'Analise', to: '/analise' },
];

interface AppLayoutProps {
  title?: string;
  children: ReactNode;
}

export default function AppLayout({ title, children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(true);

  function handleLogout() {
    logout();
    navigate('/');
  }

  function irPara(to: string) {
    setMenuAberto(false);
    navigate(to);
  }

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.hamburgerButton}
        onClick={() => setMenuAberto((prev) => !prev)}
        aria-label="Abrir menu"
      >
        {menuAberto ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`${styles.sidebar} ${!menuAberto ? styles.sidebarClosed : ''}`}>
        <img src={logo} alt="Hannah Calmon" className={styles.logo} />

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.to}
              type="button"
              className={`${styles.navLink} ${
                location.pathname.startsWith(item.to) ? styles.navLinkActive : ''
              }`}
              onClick={() => irPara(item.to)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <hr className={styles.divider} />

        <div className={styles.navFooter}>
          <button
            type="button"
            className={`${styles.navLink} ${
              location.pathname.startsWith('/configuracoes') ? styles.navLinkActive : ''
            }`}
            onClick={() => irPara('/configuracoes')}
          >
            Configurações
          </button>
          <button type="button" className={styles.navLink} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        {title && <h1 className={styles.pageTitle}>{title}</h1>}
        {children}
      </main>
    </div>
  );
}
