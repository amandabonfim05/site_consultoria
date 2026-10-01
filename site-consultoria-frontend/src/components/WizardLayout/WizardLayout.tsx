import { useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import styles from './WizardLayout.module.css';
import logo from '../../assets/logo.svg';

const STEP_LABELS = [
  'Objetivos Financeiros',
  'Situação Profissional',
  'Patrimônio e dividas',
  'Proteção financeira',
  'Aposentadoria',
  'Orçamento',
  'Recomendação',
  'Diagnóstico',
  'Plano',
];

interface WizardLayoutProps {
  stepIndex: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function WizardLayout({ stepIndex, title, subtitle, children }: WizardLayoutProps) {
  const [menuAberto, setMenuAberto] = useState(true);

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

        <nav className={styles.stepsNav}>
          {STEP_LABELS.map((label, index) => (
            <span
              key={label}
              className={`${styles.stepItem} ${
                index === stepIndex ? styles.stepItemActive : ''
              } ${index < stepIndex ? styles.stepItemDone : ''}`}
            >
              {label}
            </span>
          ))}
        </nav>
      </aside>

      <main className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {children}
      </main>
    </div>
  );
}
