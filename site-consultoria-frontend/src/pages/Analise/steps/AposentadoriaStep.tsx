import WizardLayout from '../../../components/WizardLayout/WizardLayout';
import StepFooter from '../../../components/WizardLayout/StepFooter';
import OptionGroup from '../../../components/WizardLayout/OptionGroup';
import styles from '../../../components/WizardLayout/WizardLayout.module.css';
import type { StepProps } from '../wizardTypes';
import CampoMoeda from '../../../components/WizardLayout/CampoMoeda';

const SIM_NAO = ['Sim', 'Não'];
const DECLARACOES_IR = ['Completa', 'Simplificada', 'Isento'];

export default function AposentadoriaStep({ data, setData, onBack, onContinue }: StepProps) {
  const { aposentadoria } = data;

  function update(field: keyof typeof aposentadoria, value: string) {
    setData((prev) => ({ ...prev, aposentadoria: { ...prev.aposentadoria, [field]: value } }));
  }

  return (
    <WizardLayout
      stepIndex={4}
      title="Aposentadoria"
      subtitle="Planejamento para independência financeira no longo prazo"
    >
      <p className={styles.sectionTitle}>Informações Fiscais</p>
      <p className={styles.sectionHint}>Dados sobre sua declaração de imposto de renda</p>
      <div className={styles.field} style={{ maxWidth: 400 }}>
        <label>Como foi a última declaração de IR?</label>
        <OptionGroup
          options={DECLARACOES_IR}
          value={aposentadoria.declaracaoIR}
          onChange={(value) => update('declaracaoIR', value)}
        />
      </div>

      <div className={styles.grid2} style={{ marginTop: 20 }}>
        <div className={styles.field}>
          <label>Conhece vantagens tributárias vindas de investimentos?</label>
          <OptionGroup
            options={SIM_NAO}
            value={aposentadoria.conheceVantagensTributarias}
            onChange={(value) => update('conheceVantagensTributarias', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Data de nascimento</label>
          <input
            type="date"
            value={aposentadoria.dataNascimento}
            onChange={(event) => update('dataNascimento', event.target.value)}
          />
        </div>
      </div>

      <div className={styles.field} style={{ marginTop: 20, maxWidth: 400 }}>
        <label>Já está aposentado?</label>
        <OptionGroup
          options={SIM_NAO}
          value={aposentadoria.jaAposentado}
          onChange={(value) => update('jaAposentado', value)}
        />
      </div>

      <div className={styles.grid2} style={{ marginTop: 20 }}>
        <div className={styles.field}>
          <label>Idade desejada de aposentadoria</label>
          <input
            inputMode="numeric"
            value={aposentadoria.idadeDesejada}
            onChange={(event) => update('idadeDesejada', event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label>Renda desejada na aposentadoria</label>
          <CampoMoeda
            value={aposentadoria.rendaDesejada}
            onChange={(value) => update('rendaDesejada', value)}
          />
        </div>
      </div>

      <div className={styles.grid2} style={{ marginTop: 20 }}>
        <div className={styles.field}>
          <label>Possui estratégia para aposentadoria?</label>
          <OptionGroup
            options={SIM_NAO}
            value={aposentadoria.possuiEstrategia}
            onChange={(value) => update('possuiEstrategia', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Já fez alguma projeção para aposentadoria?</label>
          <OptionGroup
            options={SIM_NAO}
            value={aposentadoria.jaFezProjecao}
            onChange={(value) => update('jaFezProjecao', value)}
          />
        </div>
      </div>

      <StepFooter onBack={onBack} onContinue={onContinue} />
    </WizardLayout>
  );
}
