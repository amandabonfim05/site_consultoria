import { useNavigate } from 'react-router-dom';
import WizardLayout from '../../../components/WizardLayout/WizardLayout';
import StepFooter from '../../../components/WizardLayout/StepFooter';
import OptionGroup from '../../../components/WizardLayout/OptionGroup';
import styles from '../../../components/WizardLayout/WizardLayout.module.css';
import { OBJETIVOS_DISPONIVEIS, type ObjetivoFinanceiro } from '../../../types/analise';
import type { StepProps } from '../wizardTypes';
import CampoMoeda from '../../../components/WizardLayout/CampoMoeda';

function criarObjetivo(nome: string, prioridade: number): ObjetivoFinanceiro {
  return {
    id: `${nome}-${Date.now()}`,
    nome,
    prioridade,
    motivo: '',
    prazo: '',
    valorNecessario: '',
    possuiValorGuardado: '',
    valorGuardado: '',
    estrategia: '',
  };
}

export default function ObjetivosStep({ data, setData, onContinue }: StepProps) {
  const navigate = useNavigate();

  function toggleObjetivo(nome: string) {
    setData((prev) => {
      const existe = prev.objetivos.some((objetivo) => objetivo.nome === nome);
      if (existe) {
        return { ...prev, objetivos: prev.objetivos.filter((objetivo) => objetivo.nome !== nome) };
      }
      return {
        ...prev,
        objetivos: [...prev.objetivos, criarObjetivo(nome, prev.objetivos.length + 1)],
      };
    });
  }

  function updateObjetivo(id: string, field: keyof ObjetivoFinanceiro, value: string) {
    setData((prev) => ({
      ...prev,
      objetivos: prev.objetivos.map((objetivo) =>
        objetivo.id === id ? { ...objetivo, [field]: value } : objetivo
      ),
    }));
  }

  return (
    <WizardLayout
      stepIndex={0}
      title="Objetivos Financeiros"
      subtitle="Escolha seus objetivos financeiros em ordem de prioridade"
    >
      <p className={styles.sectionTitle} style={{ marginTop: 0 }}>
        Dados do cliente
      </p>
      <p className={styles.sectionHint}>
        Usados para salvar essa análise nos seus contatos e contratos.
      </p>
      <div className={styles.grid2} style={{ marginBottom: 28 }}>
        <div className={styles.field}>
          <label>Nome do cliente</label>
          <input
            value={data.nomeCliente}
            onChange={(event) => setData((prev) => ({ ...prev, nomeCliente: event.target.value }))}
          />
        </div>
        <div className={styles.field}>
          <label>Telefone do cliente</label>
          <input
            placeholder="(XX) x xxxx-xxxx"
            value={data.telefoneCliente}
            onChange={(event) => setData((prev) => ({ ...prev, telefoneCliente: event.target.value }))}
          />
        </div>
      </div>

      <p className={styles.sectionTitle} style={{ marginTop: 0 }}>
        Objetivos
      </p>
      <div className={styles.optionRow}>
        {OBJETIVOS_DISPONIVEIS.map((nome) => (
          <button
            key={nome}
            type="button"
            className={`${styles.optionButton} ${
              data.objetivos.some((objetivo) => objetivo.nome === nome) ? styles.optionButtonActive : ''
            }`}
            onClick={() => toggleObjetivo(nome)}
          >
            {nome}
          </button>
        ))}
      </div>

      {data.objetivos.map((objetivo, index) => (
        <div key={objetivo.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.sectionTitle} style={{ margin: 0 }}>
              Prioridade {index + 1} · {objetivo.nome}
            </p>
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Por que esse objetivo é uma prioridade?</label>
              <textarea
                value={objetivo.motivo}
                onChange={(event) => updateObjetivo(objetivo.id, 'motivo', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Como pretende realizar esse objetivo?</label>
              <textarea
                value={objetivo.estrategia}
                onChange={(event) => updateObjetivo(objetivo.id, 'estrategia', event.target.value)}
              />
            </div>
          </div>

          <div className={styles.grid3} style={{ marginTop: 16 }}>
            <div className={styles.field}>
              <label>Quando quer conquistar?</label>
              <input
                value={objetivo.prazo}
                placeholder="Ex.: em 3 anos"
                onChange={(event) => updateObjetivo(objetivo.id, 'prazo', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Quanto precisa para conquistar?</label>
              <CampoMoeda
                value={objetivo.valorNecessario}
                onChange={(value) => updateObjetivo(objetivo.id, 'valorNecessario', value)}
              />
            </div>
            <div className={styles.field}>
              <label>Já tem valor guardado?</label>
              <OptionGroup
                options={['Sim', 'Não']}
                value={objetivo.possuiValorGuardado}
                onChange={(value) => updateObjetivo(objetivo.id, 'possuiValorGuardado', value)}
              />
            </div>
          </div>

          {objetivo.possuiValorGuardado === 'Sim' && (
            <div className={styles.field} style={{ marginTop: 16, maxWidth: 300 }}>
              <label>Quanto já tem guardado?</label>
              <CampoMoeda
                value={objetivo.valorGuardado}
                onChange={(value) => updateObjetivo(objetivo.id, 'valorGuardado', value)}
              />
            </div>
          )}
        </div>
      ))}

      <StepFooter onBack={() => navigate('/dashboard')} onContinue={onContinue} backLabel="Cancelar" />
    </WizardLayout>
  );
}
