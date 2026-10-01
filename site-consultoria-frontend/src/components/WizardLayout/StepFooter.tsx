import styles from './WizardLayout.module.css';

interface StepFooterProps {
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  backLabel?: string;
}

export default function StepFooter({
  onBack,
  onContinue,
  continueLabel = 'Continuar →',
  backLabel = 'Voltar',
}: StepFooterProps) {
  return (
    <div className={styles.footer}>
      {onBack ? (
        <button type="button" className={styles.backLink} onClick={onBack}>
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      <button type="button" className={styles.continueButton} onClick={onContinue}>
        {continueLabel}
      </button>
    </div>
  );
}
