import { useEffect } from 'react';
import WizardLayout from '../../../components/WizardLayout/WizardLayout';
import CampoMoeda from '../../../components/WizardLayout/CampoMoeda';
import styles from '../../../components/WizardLayout/WizardLayout.module.css';
import { PLANOS_ACOMPANHAMENTO, calcularValorConsultoria } from '../../../types/analise';
import { paraNumero, formatarEntradaMoeda } from '../../../utils/moeda';
import type { StepProps } from '../wizardTypes';

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PlanoStep({ data, setData, onBack, onContinue }: StepProps) {
  const { plano } = data;

  function update<K extends keyof typeof plano>(field: K, value: (typeof plano)[K]) {
    setData((prev) => ({ ...prev, plano: { ...prev.plano, [field]: value } }));
  }

  useEffect(() => {
    if (plano.rendaBrutaAnual) return;

    const rendaMensal = Object.values(data.orcamento.renda).reduce(
      (sum, valor) => sum + paraNumero(valor),
      0
    );

    if (rendaMensal > 0) {
      const rendaAnual = rendaMensal * 12;
      const centavos = Math.round(rendaAnual * 100);
      const reaisTexto = Math.floor(centavos / 100).toString();
      const centavosTexto = (centavos % 100).toString().padStart(2, '0');
      update('rendaBrutaAnual', formatarEntradaMoeda(`${reaisTexto},${centavosTexto}`));
    }

  }, []);

  const calculo = calcularValorConsultoria(data);

  function finalizar(status: 'APROVADA' | 'REPROVADA') {
    onContinue({ statusAnalise: status });
  }

  return (
    <WizardLayout stepIndex={8} title={`Renda bruta anual R$ ${plano.rendaBrutaAnual || '00.000,00'}`}>
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label>Renda bruta anual</label>
          <CampoMoeda
            value={plano.rendaBrutaAnual}
            onChange={(value) => update('rendaBrutaAnual', value)}
          />
        </div>
        <div className={styles.field}>
          <label>Cupom de desconto</label>
          <input
            value={plano.cupom}
            placeholder="Cupom"
            onChange={(event) => update('cupom', event.target.value)}
          />
        </div>
      </div>

      <p className={styles.sectionTitle}>Forma de pagamento</p>
      <div className={styles.optionRow}>
        <button
          type="button"
          className={`${styles.optionButton} ${
            plano.formaPagamento === 'avista' ? styles.optionButtonActive : ''
          }`}
          onClick={() => update('formaPagamento', 'avista')}
        >
          À vista
        </button>
        <button
          type="button"
          className={`${styles.optionButton} ${
            plano.formaPagamento === 'parcelado' ? styles.optionButtonActive : ''
          }`}
          onClick={() => update('formaPagamento', 'parcelado')}
        >
          Parcelado
        </button>
      </div>

      <p className={styles.sectionTitle}>Escolha seu acompanhamento</p>
      <div className={styles.grid3}>
        {PLANOS_ACOMPANHAMENTO.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            style={
              plano.planoSelecionado === item.id
                ? { borderColor: 'var(--fundo-a)', borderWidth: 2 }
                : undefined
            }
          >
            <p className={styles.sectionTitle} style={{ marginTop: 0 }}>
              {item.nome}
            </p>
            <ul style={{ fontSize: 12, paddingLeft: 18, margin: '8px 0' }}>
              {item.beneficios.map((beneficio) => (
                <li key={beneficio}>{beneficio}</li>
              ))}
            </ul>
            <p style={{ fontWeight: 900, fontSize: 14 }}>R$ {formatarMoeda(item.preco)}/mês</p>
            <button
              type="button"
              className={styles.continueButton}
              style={{ width: '100%' }}
              onClick={() =>
                update('planoSelecionado', plano.planoSelecionado === item.id ? '' : item.id)
              }
            >
              {plano.planoSelecionado === item.id ? 'Selecionado ✓' : 'Selecionar'}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.card} style={{ maxWidth: 360 }}>
        <p className={styles.sectionTitle} style={{ marginTop: 0 }}>
          Valor da consultoria
        </p>
        {calculo.precoPlano > 0 && (
          <p className={styles.sectionHint} style={{ margin: '0 0 2px' }}>
            + R$ {formatarMoeda(calculo.precoPlano)} do plano selecionado
          </p>
        )}
        {calculo.desconto > 0 && (
          <p className={styles.sectionHint} style={{ margin: '0 0 2px', color: 'var(--success)' }}>
            Cupom aplicado: {calculo.desconto}% de desconto
          </p>
        )}
        {calculo.acrescimoParcelamento > 0 && (
          <p className={styles.sectionHint} style={{ margin: '0 0 8px' }}>
            (R$ {formatarMoeda(calculo.acrescimoParcelamento)})
          </p>
        )}
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, margin: 0 }}>
          R$ {formatarMoeda(calculo.valorFinal)}
        </p>
        {calculo.parcelas > 1 && (
          <p className={styles.sectionHint} style={{ marginTop: 4 }}>
            {calculo.parcelas}x de R$ {formatarMoeda(calculo.valorParcela)}
          </p>
        )}
      </div>

      <p className={styles.sectionTitle}>Decisão da análise</p>
      <div className={styles.footer}>
        <button type="button" className={styles.backLink} onClick={onBack}>
          Voltar
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            className={styles.optionButton}
            style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
            onClick={() => finalizar('REPROVADA')}
          >
            Não aprovar
          </button>
          <button type="button" className={styles.continueButton} onClick={() => finalizar('APROVADA')}>
            Aprovar análise
          </button>
        </div>
      </div>
    </WizardLayout>
  );
}