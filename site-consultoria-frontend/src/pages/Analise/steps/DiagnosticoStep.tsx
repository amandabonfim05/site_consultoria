import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import WizardLayout from '../../../components/WizardLayout/WizardLayout';
import StepFooter from '../../../components/WizardLayout/StepFooter';
import styles from '../../../components/WizardLayout/WizardLayout.module.css';
import { enviarDiagnosticoPorEmail } from '../../../services/diagnostico';
import type { StepProps } from '../wizardTypes';

const CORES = ['#0a2540', '#f4b942', '#5b6674', '#2f7a55', '#c23b32'];

function preenchido(valor: string): boolean {
  return Boolean(valor && valor.trim() !== '');
}

function contarPreenchidos(valores: string[]): number {
  return valores.filter(preenchido).length;
}

function parseValor(value: string): number {
  const parsed = Number((value ?? '').replace(',', '.'));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function calcularDiagnostico(data: StepProps['data']) {
  const somaCategorias = (valores: Record<string, string>) =>
    Object.values(valores).reduce((sum, valor) => sum + parseValor(valor), 0);
  const rendaTotal = somaCategorias(data.orcamento.renda);
  const gastosTotal =
    somaCategorias(data.orcamento.gastosFixos) + somaCategorias(data.orcamento.gastosVariaveis);
  const organizacao =
    contarPreenchidos([data.orcamento.fazControleGastos, data.orcamento.investeMensalmente]) +
    (data.patrimonio.perfilInvestidor ? 1 : 0) +
    (rendaTotal > 0 && rendaTotal > gastosTotal ? 1 : 0);

  const objetivosCompletos = data.objetivos.filter(
    (objetivo) => preenchido(objetivo.motivo) && preenchido(objetivo.prazo) && preenchido(objetivo.valorNecessario)
  ).length;
  const objetivos = Math.min(objetivosCompletos, 4);

  const protecao = contarPreenchidos([
    data.protecaoFinanceira.possuiPlanoSaude,
    data.protecaoFinanceira.possuiProtecaoTrabalho,
    data.protecaoFinanceira.possuiProtecaoDependentes,
    data.protecaoFinanceira.possuiSeguroTrabalho,
    data.protecaoFinanceira.possuiEstrategiaSucessao,
  ].filter((valor) => valor === 'Sim'));

  const expansaoCapital =
    (parseValor(data.patrimonio.aplicacoesFinanceiras) > 0 ? 1 : 0) +
    (parseValor(data.orcamento.investimentos) > 0 ? 1 : 0) +
    (data.patrimonio.imoveis.length > 0 ? 1 : 0) +
    (data.orcamento.conheceMilhas === 'Sim' ? 1 : 0);

  const aposentadoria = contarPreenchidos([
    data.aposentadoria.possuiEstrategia === 'Sim' ? 'sim' : '',
    data.aposentadoria.jaFezProjecao === 'Sim' ? 'sim' : '',
    data.aposentadoria.idadeDesejada,
    data.aposentadoria.rendaDesejada,
  ]);

  const categorias = [
    { label: 'Organização Financeira', value: organizacao, max: 4 },
    { label: 'Objetivos Financeiros', value: objetivos, max: 4 },
    { label: 'Proteção Financeira', value: protecao, max: 5 },
    { label: 'Expansão de Capital', value: expansaoCapital, max: 4 },
    { label: 'Planejamento de Aposentadoria', value: aposentadoria, max: 4 },
  ];

  const totalConquistado = categorias.reduce((sum, categoria) => sum + categoria.value, 0);
  const totalMaximo = categorias.reduce((sum, categoria) => sum + categoria.max, 0);
  const nota = totalMaximo > 0 ? Math.round((totalConquistado / totalMaximo) * 100) : 0;

  return { categorias, nota, totalConquistado };
}

export default function DiagnosticoStep({ data, onBack, onContinue }: StepProps) {
  const graficoRef = useRef<HTMLDivElement>(null);
  const [mostrarEnvioEmail, setMostrarEnvioEmail] = useState(false);
  const [imagemGrafico, setImagemGrafico] = useState<string | null>(null);
  const [capturandoImagem, setCapturandoImagem] = useState(false);
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const { categorias, nota, totalConquistado } = calcularDiagnostico(data);
  const temDadosSuficientes = totalConquistado > 0;

  const perfilTexto =
    nota >= 70 ? 'Planejador Experiente' : nota >= 40 ? 'Em construção' : 'Início de jornada';

  async function irParaTelaDeEmail() {
    if (graficoRef.current && temDadosSuficientes) {
      setCapturandoImagem(true);
      try {
        const png = await toPng(graficoRef.current, { backgroundColor: '#ffffff', pixelRatio: 2 });
        setImagemGrafico(png);
      } catch {
        setImagemGrafico(null);
      } finally {
        setCapturandoImagem(false);
      }
    }
    setMostrarEnvioEmail(true);
  }

  async function handleEnviarEmail() {
    if (!imagemGrafico) {
      setErroEnvio('Não foi possível capturar o gráfico. Volte ao diagnóstico e tente de novo.');
      return;
    }

    setErroEnvio(null);
    setEnviando(true);
    try {
      await enviarDiagnosticoPorEmail(
        email,
        {
          nota,
          perfil: perfilTexto,
          categorias: categorias.map(({ label, value, max }) => ({ label, value, max })),
        },
        imagemGrafico,
        data.nomeCliente
      );
      setEnviado(true);
    } catch (error) {
      const mensagem =
        error instanceof Error && error.message.includes('503')
          ? 'Envio de e-mail ainda não configurado no servidor.'
          : 'Não foi possível enviar — confira o e-mail digitado.';
      setErroEnvio(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  if (mostrarEnvioEmail) {
    return (
      <WizardLayout stepIndex={7} title="Enviar diagnóstico por e-mail">
        <div className={styles.card} style={{ maxWidth: 480 }}>
          {!enviado ? (
            <>
              <p className={styles.sectionHint}>
                Envie uma cópia deste diagnóstico (com o gráfico, em PDF) para o e-mail do cliente
                ou o seu.
              </p>
              <div className={styles.field}>
                <label htmlFor="emailDiagnostico">E-mail de destino</label>
                <input
                  id="emailDiagnostico"
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              {erroEnvio && <p className={styles.errorMessage}>{erroEnvio}</p>}
              <div style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className={styles.continueButton}
                  disabled={enviando || !email || !imagemGrafico}
                  onClick={handleEnviarEmail}
                >
                  {enviando ? 'Enviando...' : 'Enviar diagnóstico'}
                </button>
              </div>
            </>
          ) : (
            <p className={styles.sectionTitle} style={{ marginTop: 0 }}>
              ✓ Diagnóstico enviado para {email}
            </p>
          )}
        </div>

        <StepFooter
          onBack={() => setMostrarEnvioEmail(false)}
          onContinue={onContinue}
          continueLabel={enviado ? 'Continuar →' : 'Pular e continuar →'}
          backLabel="Voltar ao diagnóstico"
        />
      </WizardLayout>
    );
  }

  return (
    <WizardLayout stepIndex={7} title={`Diagnóstico · ${data.situacaoProfissional.profissao || 'Consultoria'}`}>
      <div className={styles.grid2} style={{ alignItems: 'center' }}>
        <div>
          <p className={styles.sectionTitle} style={{ fontSize: 22 }}>
            {perfilTexto}
          </p>
          <p className={styles.sectionHint}>
            Organize suas finanças para construir o futuro que deseja. Parabéns por iniciar sua
            jornada — ter clareza sobre suas receitas, patrimônio e objetivos já é um passo essencial
            para alcançar independência financeira.
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p className={styles.sectionTitle} style={{ fontSize: 40, margin: 0 }}>
            {nota}
            <span style={{ fontSize: 16 }}>/100</span>
          </p>
          <p className={styles.sectionHint}>Nota conquistada</p>
        </div>
      </div>

      <div
        className={styles.card}
        style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}
      >
        {temDadosSuficientes ? (
          <>
            <div ref={graficoRef} style={{ width: 240, height: 240, backgroundColor: '#ffffff' }}>
              <ResponsiveContainer width={240} height={240}>
                <PieChart>
                  <Pie
                    data={categorias}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    cornerRadius={6}
                    stroke="none"
                  >
                    {categorias.map((categoria, index) => (
                      <Cell key={categoria.label} fill={CORES[index % CORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categorias.map((categoria, index) => (
                <div key={categoria.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: CORES[index % CORES.length],
                      display: 'inline-block',
                    }}
                  />
                  {categoria.label} · {categoria.value}/{categoria.max}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className={styles.sectionHint} style={{ margin: 0 }}>
            Responda mais perguntas nas etapas anteriores para gerar o gráfico do diagnóstico.
          </p>
        )}
      </div>

      <StepFooter
        onBack={onBack}
        onContinue={irParaTelaDeEmail}
        continueLabel={capturandoImagem ? 'Preparando...' : 'Continuar →'}
      />
    </WizardLayout>
  );
}