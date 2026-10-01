import type { ReactNode } from 'react';
import { ShieldCheck, Compass, TrendingUp, Clock, Sprout } from 'lucide-react';
import styles from './AuthLayout.module.css';
import logo from '../../assets/logo.svg';

const PILARES = [
  { label: 'Segurança Financeira', Icon: ShieldCheck },
  { label: 'Planejamento 360', Icon: Compass },
  { label: 'Crescimento de Patrimônio', Icon: TrendingUp },
  { label: 'Valorize seu tempo', Icon: Clock },
  { label: 'Invista no futuro', Icon: Sprout },
];

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.sidebar}>
          <img src={logo} alt="Hannah Calmon" className={styles.logo} />

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>

          {children}
        </div>

        <div className={styles.hero}>
          <h2 className={styles.headline}>
            Comece seu planejamento financeiro da melhor forma!
          </h2>

          <div className={styles.pillars}>
            {PILARES.map(({ label, Icon }) => (
              <div className={styles.pillar} key={label}>
                <Icon className={styles.pillarIcon} strokeWidth={1.75} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
