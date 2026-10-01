import WizardLayout from '../../../components/WizardLayout/WizardLayout';
import StepFooter from '../../../components/WizardLayout/StepFooter';
import OptionGroup from '../../../components/WizardLayout/OptionGroup';
import styles from '../../../components/WizardLayout/WizardLayout.module.css';
import type { StepProps } from '../wizardTypes';

const ESTADOS_CIVIS = ['Solteiro(a)', 'Casado(a)', 'União Estável', 'Divorciado(a)', 'Viúvo(a)'];
const SIM_NAO = ['Sim', 'Não'];
const TIPOS_PARTILHA = ['Comunhão parcial', 'Comunhão universal', 'Separação total'];

export default function ProtecaoFinanceiraStep({ data, setData, onBack, onContinue }: StepProps) {
  const { protecaoFinanceira } = data;

  function update(field: keyof typeof protecaoFinanceira, value: string) {
    setData((prev) => ({
      ...prev,
      protecaoFinanceira: { ...prev.protecaoFinanceira, [field]: value },
    }));
  }

  const casado = protecaoFinanceira.estadoCivil === 'Casado(a)' || protecaoFinanceira.estadoCivil === 'União Estável';

  return (
    <WizardLayout
      stepIndex={3}
      title="Proteção Financeira"
      subtitle="Proteção contra riscos, dívidas e imprevistos"
    >
      <p className={styles.sectionTitle}>Informações familiares</p>
      <div className={styles.grid3}>
        <div className={styles.field}>
          <label>Estado civil</label>
          <OptionGroup
            options={ESTADOS_CIVIS}
            value={protecaoFinanceira.estadoCivil}
            onChange={(value) => update('estadoCivil', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Possui filhos</label>
          <OptionGroup
            options={SIM_NAO}
            value={protecaoFinanceira.possuiFilhos}
            onChange={(value) => update('possuiFilhos', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Possui pets</label>
          <OptionGroup
            options={SIM_NAO}
            value={protecaoFinanceira.possuiPets}
            onChange={(value) => update('possuiPets', value)}
          />
        </div>
      </div>

      {casado && (
        <>
          <p className={styles.sectionTitle}>Informações do Cônjuge</p>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Nome</label>
              <input
                value={protecaoFinanceira.conjugeNome}
                onChange={(event) => update('conjugeNome', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Data de nascimento</label>
              <input
                type="date"
                value={protecaoFinanceira.conjugeDataNascimento}
                onChange={(event) => update('conjugeDataNascimento', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Tipo de partilha</label>
              <OptionGroup
                options={TIPOS_PARTILHA}
                value={protecaoFinanceira.conjugeTipoPartilha}
                onChange={(value) => update('conjugeTipoPartilha', value)}
              />
            </div>
            <div className={styles.field}>
              <label>Profissão</label>
              <input
                value={protecaoFinanceira.conjugeProfissao}
                onChange={(event) => update('conjugeProfissao', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Gênero</label>
              <input
                value={protecaoFinanceira.conjugeGenero}
                onChange={(event) => update('conjugeGenero', event.target.value)}
              />
            </div>
          </div>
        </>
      )}

      <p className={styles.sectionTitle}>Proteção Financeira</p>
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label>Possui plano de saúde?</label>
          <OptionGroup
            options={SIM_NAO}
            value={protecaoFinanceira.possuiPlanoSaude}
            onChange={(value) => update('possuiPlanoSaude', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Possui proteção da força de trabalho?</label>
          <OptionGroup
            options={SIM_NAO}
            value={protecaoFinanceira.possuiProtecaoTrabalho}
            onChange={(value) => update('possuiProtecaoTrabalho', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Possui proteção para dependentes?</label>
          <OptionGroup
            options={SIM_NAO}
            value={protecaoFinanceira.possuiProtecaoDependentes}
            onChange={(value) => update('possuiProtecaoDependentes', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Possui seguro para bens relativos ao trabalho?</label>
          <OptionGroup
            options={SIM_NAO}
            value={protecaoFinanceira.possuiSeguroTrabalho}
            onChange={(value) => update('possuiSeguroTrabalho', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Conhece estratégias para sucessão patrimonial?</label>
          <OptionGroup
            options={SIM_NAO}
            value={protecaoFinanceira.conheceSucessao}
            onChange={(value) => update('conheceSucessao', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Possui estratégia definida e ativa para sucessão patrimonial?</label>
          <OptionGroup
            options={SIM_NAO}
            value={protecaoFinanceira.possuiEstrategiaSucessao}
            onChange={(value) => update('possuiEstrategiaSucessao', value)}
          />
        </div>
      </div>

      <StepFooter onBack={onBack} onContinue={onContinue} />
    </WizardLayout>
  );
}
