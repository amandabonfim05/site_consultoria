import WizardLayout from '../../../components/WizardLayout/WizardLayout';
import StepFooter from '../../../components/WizardLayout/StepFooter';
import OptionGroup from '../../../components/WizardLayout/OptionGroup';
import CampoMoeda from '../../../components/WizardLayout/CampoMoeda';
import styles from '../../../components/WizardLayout/WizardLayout.module.css';
import { paraNumero } from '../../../utils/moeda';
import type { Imovel } from '../../../types/analise';
import type { StepProps } from '../wizardTypes';

const PERFIS_INVESTIDOR = ['Conservador', 'Moderado', 'Arrojado'];
const MORADIAS = ['Própria', 'Financiada', 'Alugada'];

export default function PatrimonioStep({ data, setData, onBack, onContinue }: StepProps) {
  const { patrimonio } = data;

  function update(field: keyof typeof patrimonio, value: string) {
    setData((prev) => ({ ...prev, patrimonio: { ...prev.patrimonio, [field]: value } }));
  }

  function addImovel() {
    const novo: Imovel = { id: `imovel-${Date.now()}`, descricao: '', valor: '' };
    setData((prev) => ({
      ...prev,
      patrimonio: { ...prev.patrimonio, imoveis: [...prev.patrimonio.imoveis, novo] },
    }));
  }

  function updateImovel(id: string, field: keyof Imovel, value: string) {
    setData((prev) => ({
      ...prev,
      patrimonio: {
        ...prev.patrimonio,
        imoveis: prev.patrimonio.imoveis.map((imovel) =>
          imovel.id === id ? { ...imovel, [field]: value } : imovel
        ),
      },
    }));
  }

  function removeImovel(id: string) {
    setData((prev) => ({
      ...prev,
      patrimonio: {
        ...prev.patrimonio,
        imoveis: prev.patrimonio.imoveis.filter((imovel) => imovel.id !== id),
      },
    }));
  }

  const totalImoveis = patrimonio.imoveis.reduce((sum, imovel) => sum + paraNumero(imovel.valor), 0);
  const totalAtivos =
    totalImoveis +
    paraNumero(patrimonio.automoveis) +
    paraNumero(patrimonio.aplicacoesFinanceiras) +
    paraNumero(patrimonio.outrosBens);
  const totalPassivos = paraNumero(patrimonio.dividas);
  const patrimonioLiquido = totalAtivos - totalPassivos;

  return (
    <WizardLayout
      stepIndex={2}
      title="Patrimônio e dividas"
      subtitle="Organize seus bens e compromissos financeiros"
    >
      <p className={styles.sectionTitle}>Capacidade de Poupança</p>
      <p className={styles.sectionHint}>Valores que consegue poupar mensalmente</p>
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label>Capacidade mínima de poupar</label>
          <CampoMoeda
            value={patrimonio.capacidadeMinimaPoupar}
            onChange={(value) => update('capacidadeMinimaPoupar', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Capacidade máxima de poupar</label>
          <CampoMoeda
            value={patrimonio.capacidadeMaximaPoupar}
            onChange={(value) => update('capacidadeMaximaPoupar', value)}
          />
        </div>
      </div>

      <p className={styles.sectionTitle}>Instituição Financeira</p>
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label>Instituição financeira principal</label>
          <input
            value={patrimonio.instituicaoPrincipal}
            onChange={(event) => update('instituicaoPrincipal', event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label>Todas as instituições que utiliza</label>
          <input
            value={patrimonio.todasInstituicoes}
            onChange={(event) => update('todasInstituicoes', event.target.value)}
          />
        </div>
      </div>

      <p className={styles.sectionTitle}>Perfil do investidor</p>
      <OptionGroup
        options={PERFIS_INVESTIDOR}
        value={patrimonio.perfilInvestidor}
        onChange={(value) => update('perfilInvestidor', value)}
      />

      <p className={styles.sectionTitle}>Situação da Moradia</p>
      <OptionGroup
        options={MORADIAS}
        value={patrimonio.moradiaAtual}
        onChange={(value) => update('moradiaAtual', value)}
      />

      <p className={styles.sectionTitle}>Cadastro de imóvel</p>
      {patrimonio.imoveis.map((imovel) => (
        <div key={imovel.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <span />
            <button type="button" className={styles.removeButton} onClick={() => removeImovel(imovel.id)}>
              Remover
            </button>
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Descrição</label>
              <input
                value={imovel.descricao}
                onChange={(event) => updateImovel(imovel.id, 'descricao', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Valor estimado</label>
              <CampoMoeda
                value={imovel.valor}
                onChange={(value) => updateImovel(imovel.id, 'valor', value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addButton} onClick={addImovel}>
        + Adicionar imóvel
      </button>

      <p className={styles.sectionTitle}>Resumo Patrimonial</p>
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label>Automóveis</label>
          <CampoMoeda value={patrimonio.automoveis} onChange={(value) => update('automoveis', value)} />
        </div>
        <div className={styles.field}>
          <label>Aplicações financeiras</label>
          <CampoMoeda
            value={patrimonio.aplicacoesFinanceiras}
            onChange={(value) => update('aplicacoesFinanceiras', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Dívidas</label>
          <CampoMoeda value={patrimonio.dividas} onChange={(value) => update('dividas', value)} />
        </div>
        <div className={styles.field}>
          <label>Outros bens</label>
          <CampoMoeda value={patrimonio.outrosBens} onChange={(value) => update('outrosBens', value)} />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.summaryRow}>
          <span>Ativos</span>
          <span>R$ {totalAtivos.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Passivos</span>
          <span>R$ {totalPassivos.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
          <span>Patrimônio Líquido</span>
          <span>R$ {patrimonioLiquido.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <StepFooter onBack={onBack} onContinue={onContinue} />
    </WizardLayout>
  );
}