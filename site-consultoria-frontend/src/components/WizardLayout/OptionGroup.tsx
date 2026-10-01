import styles from './WizardLayout.module.css';

interface OptionGroupProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function OptionGroup({ options, value, onChange }: OptionGroupProps) {
  return (
    <div className={styles.optionRow}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`${styles.optionButton} ${value === option ? styles.optionButtonActive : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
