import WizardLayout from '../../../components/WizardLayout/WizardLayout';
import StepFooter from '../../../components/WizardLayout/StepFooter';
import OptionGroup from '../../../components/WizardLayout/OptionGroup';
import styles from '../../../components/WizardLayout/WizardLayout.module.css';
import type { StepProps } from '../wizardTypes';

const REGIMES = ['CLT', 'PJ', 'Autônomo', 'Funcionário Público'];

export default function SituacaoProfissionalStep({ data, setData, onBack, onContinue }: StepProps) {
  const { situacaoProfissional } = data;

  function update(field: keyof typeof situacaoProfissional, value: string) {
    setData((prev) => ({
      ...prev,
      situacaoProfissional: { ...prev.situacaoProfissional, [field]: value },
    }));
  }

  return (
    <WizardLayout
      stepIndex={1}
      title="Situação Profissional"
      subtitle="Vamos entender sua situação financeira atual"
    >
      <div className={styles.field} style={{ maxWidth: 500 }}>
        <label>Profissão</label>
        <input
          value={situacaoProfissional.profissao}
          onChange={(event) => update('profissao', event.target.value)}
        />
      </div>

      <p className={styles.sectionTitle}>Regime de trabalho</p>
      <OptionGroup
        options={REGIMES}
        value={situacaoProfissional.regimeTrabalho}
        onChange={(value) => update('regimeTrabalho', value)}
      />

      <StepFooter onBack={onBack} onContinue={onContinue} />
    </WizardLayout>
  );
}
