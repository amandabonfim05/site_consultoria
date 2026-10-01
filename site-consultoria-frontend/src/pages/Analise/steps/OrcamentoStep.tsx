import WizardLayout from '../../../components/WizardLayout/WizardLayout';
import StepFooter from '../../../components/WizardLayout/StepFooter';
import OptionGroup from '../../../components/WizardLayout/OptionGroup';
import CategoryTable from '../../../components/WizardLayout/CategoryTable';
import CampoMoeda from '../../../components/WizardLayout/CampoMoeda';
import styles from '../../../components/WizardLayout/WizardLayout.module.css';
import { paraNumero } from '../../../utils/moeda';
import {
  RENDA_CATEGORIAS,
  GASTOS_FIXOS_CATEGORIAS,
  GASTOS_VARIAVEIS_CATEGORIAS,
  type CartaoCredito,
} from '../../../types/analise';
import type { StepProps } from '../wizardTypes';

const SIM_NAO = ['Sim', 'Não'];
const FORMAS_GASTO = ['Dinheiro', 'Débito', 'Crédito', 'Pix'];

function somaCategorias(values: Record<string, string>): number {
  return Object.values(values).reduce((sum, value) => sum + paraNumero(value), 0);
}

export default function OrcamentoStep({ data, setData, onBack, onContinue }: StepProps) {
  const { orcamento } = data;

  function update<K extends keyof typeof orcamento>(field: K, value: (typeof orcamento)[K]) {
    setData((prev) => ({ ...prev, orcamento: { ...prev.orcamento, [field]: value } }));
  }

  function updateCategoria(
    grupo: 'renda' | 'gastosFixos' | 'gastosVariaveis',
    categoria: string,
    value: string
  ) {
    setData((prev) => ({
      ...prev,
      orcamento: {
        ...prev.orcamento,
        [grupo]: { ...prev.orcamento[grupo], [categoria]: value },
      },
    }));
  }

  function addCartao() {
    const novo: CartaoCredito = {
      id: `cartao-${Date.now()}`,
      nome: '',
      descricao: '',
      limiteTotal: '',
      limiteDisponivel: '',
    };
    update('cartoes', [...orcamento.cartoes, novo]);
  }

  function updateCartao(id: string, field: keyof CartaoCredito, value: string) {
    update(
      'cartoes',
      orcamento.cartoes.map((cartao) => (cartao.id === id ? { ...cartao, [field]: value } : cartao))
    );
  }

  function removeCartao(id: string) {
    update('cartoes', orcamento.cartoes.filter((cartao) => cartao.id !== id));
  }

  const totalRenda = somaCategorias(orcamento.renda);
  const totalGastosFixos = somaCategorias(orcamento.gastosFixos);
  const totalGastosVariaveis = somaCategorias(orcamento.gastosVariaveis);
  const protecao = paraNumero(orcamento.protecao);
  const investimentos = paraNumero(orcamento.investimentos);
  const saldoFinal = totalRenda - totalGastosFixos - totalGastosVariaveis - protecao - investimentos;

  return (
    <WizardLayout stepIndex={5} title="Orçamento" subtitle="Controle suas receitas e despesas para alcançar equilíbrio financeiro">
      <p className={styles.sectionTitle}>Hábitos de Consumo</p>
      <div className={styles.field} style={{ maxWidth: 500 }}>
        <label>Forma de gastos mais usada</label>
        <OptionGroup
          options={FORMAS_GASTO}
          value={orcamento.formaGastos}
          onChange={(value) => update('formaGastos', value)}
        />
      </div>
      <div className={styles.field} style={{ marginTop: 16, maxWidth: 500 }}>
        <label>Costuma parcelar seus gastos?</label>
        <OptionGroup
          options={SIM_NAO}
          value={orcamento.parcelaGastos}
          onChange={(value) => update('parcelaGastos', value)}
        />
      </div>

      <p className={styles.sectionTitle}>Cadastro de cartão de crédito</p>
      {orcamento.cartoes.map((cartao) => (
        <div key={cartao.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <span />
            <button type="button" className={styles.removeButton} onClick={() => removeCartao(cartao.id)}>
              Remover
            </button>
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Nome/Título do cartão</label>
              <input
                value={cartao.nome}
                onChange={(event) => updateCartao(cartao.id, 'nome', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Descrição</label>
              <input
                value={cartao.descricao}
                onChange={(event) => updateCartao(cartao.id, 'descricao', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Limite total</label>
              <CampoMoeda
                value={cartao.limiteTotal}
                onChange={(value) => updateCartao(cartao.id, 'limiteTotal', value)}
              />
            </div>
            <div className={styles.field}>
              <label>Limite disponível</label>
              <CampoMoeda
                value={cartao.limiteDisponivel}
                onChange={(value) => updateCartao(cartao.id, 'limiteDisponivel', value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addButton} onClick={addCartao}>
        + Adicionar cartão
      </button>

      <p className={styles.sectionTitle}>Fluxo de caixa · Renda</p>
      <CategoryTable
        categorias={RENDA_CATEGORIAS}
        values={orcamento.renda}
        onChange={(categoria, value) => updateCategoria('renda', categoria, value)}
      />

      <p className={styles.sectionTitle}>Gastos Fixos</p>
      <CategoryTable
        categorias={GASTOS_FIXOS_CATEGORIAS}
        values={orcamento.gastosFixos}
        onChange={(categoria, value) => updateCategoria('gastosFixos', categoria, value)}
      />

      <p className={styles.sectionTitle}>Gastos Variáveis</p>
      <CategoryTable
        categorias={GASTOS_VARIAVEIS_CATEGORIAS}
        values={orcamento.gastosVariaveis}
        onChange={(categoria, value) => updateCategoria('gastosVariaveis', categoria, value)}
      />

      <p className={styles.sectionTitle}>Proteção e Investimentos</p>
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label>Proteção (seguros)</label>
          <CampoMoeda value={orcamento.protecao} onChange={(value) => update('protecao', value)} />
        </div>
        <div className={styles.field}>
          <label>Investimentos</label>
          <CampoMoeda value={orcamento.investimentos} onChange={(value) => update('investimentos', value)} />
        </div>
      </div>

      <p className={styles.sectionTitle}>Outras informações</p>
      <div className={styles.grid3}>
        <div className={styles.field}>
          <label>Faz controle de gastos?</label>
          <OptionGroup
            options={SIM_NAO}
            value={orcamento.fazControleGastos}
            onChange={(value) => update('fazControleGastos', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Investe mensalmente?</label>
          <OptionGroup
            options={SIM_NAO}
            value={orcamento.investeMensalmente}
            onChange={(value) => update('investeMensalmente', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Conhece estratégias de milhas?</label>
          <OptionGroup
            options={SIM_NAO}
            value={orcamento.conheceMilhas}
            onChange={(value) => update('conheceMilhas', value)}
          />
        </div>
      </div>

      <p className={styles.sectionTitle}>Resumo financeiro</p>
      <div className={styles.card}>
        <div className={styles.summaryRow}>
          <span>Renda total</span>
          <span>R$ {totalRenda.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Gastos fixos</span>
          <span>R$ {totalGastosFixos.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Gastos variáveis</span>
          <span>R$ {totalGastosVariaveis.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Proteção</span>
          <span>R$ {protecao.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Investimentos</span>
          <span>R$ {investimentos.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
          <span>Saldo final</span>
          <span>R$ {saldoFinal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <StepFooter onBack={onBack} onContinue={onContinue} />
    </WizardLayout>
  );
}