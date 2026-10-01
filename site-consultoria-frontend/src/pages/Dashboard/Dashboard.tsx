import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { Pencil, Check, X } from 'lucide-react';
import AppLayout from '../../components/AppLayout/AppLayout';
import { getDashboardMetrics } from '../../services/dashboard';
import { listContatos } from '../../services/contacts';
import { updateMeta } from '../../services/meta';
import type { DashboardMetrics } from '../../types/dashboard';
import type { Contato } from '../../types/contact';
import styles from './Dashboard.module.css';

const MESES_LABEL = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function ultimosMesesLabels(quantidade: number): string[] {
  const now = new Date();
  const labels: string[] = [];
  for (let i = quantidade - 1; i >= 0; i -= 1) {
    const mesIndex = (now.getMonth() - i + 12) % 12;
    labels.push(MESES_LABEL[mesIndex]);
  }
  return labels;
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [editandoMeta, setEditandoMeta] = useState(false);
  const [novaMeta, setNovaMeta] = useState('');
  const [salvandoMeta, setSalvandoMeta] = useState(false);

  useEffect(() => {
    Promise.all([getDashboardMetrics(), listContatos()])
      .then(([metricsData, contatosData]) => {
        setMetrics(metricsData);
        setContatos(contatosData.slice(0, 7));
      })
      .catch(() => setError('Não foi possível carregar os dados do dashboard.'));
  }, []);

  const analisesSeries = useMemo(() => {
    if (!metrics) return [];
    const labels = ultimosMesesLabels(metrics.analisesPorMes.length);
    return metrics.analisesPorMes.map((valor, index) => ({ mes: labels[index], valor }));
  }, [metrics]);

  const ligacoesSeries = useMemo(() => {
    if (!metrics) return [];
    const labels = ultimosMesesLabels(metrics.ligacoesPorMes.length);
    return metrics.ligacoesPorMes.map((valor, index) => ({ mes: labels[index], valor }));
  }, [metrics]);

  const metaPercentual = metrics && metrics.meta > 0 ? Math.min((metrics.real / metrics.meta) * 100, 100) : 0;
  const goalData = [{ name: 'meta', value: metaPercentual, fill: '#f4b942' }];

  function iniciarEdicaoMeta() {
    if (!metrics) return;
    setNovaMeta(String(metrics.meta));
    setEditandoMeta(true);
  }

  async function salvarMeta() {
    const valor = Number(novaMeta.replace(',', '.'));
    if (Number.isNaN(valor) || valor < 0) return;

    setSalvandoMeta(true);
    try {
      await updateMeta(valor);
      setMetrics((prev) => (prev ? { ...prev, meta: valor } : prev));
      setEditandoMeta(false);
    } catch {

    } finally {
      setSalvandoMeta(false);
    }
  }

  return (
    <AppLayout title="Dashboard">
      {error && <p>{error}</p>}

      {metrics && (
        <div className={styles.grid}>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Análises</p>
            <p className={styles.metricValue}>{metrics.analises}</p>
            <p className={styles.metricHint}>no total</p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Aprovadas</p>
            <p className={styles.metricValue}>{metrics.aprovadas}</p>
            <p className={styles.metricHint}>no total</p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total do mês</p>
            <p className={styles.metricValue}>{formatarMoeda(metrics.totalMes)}</p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total do ano</p>
            <p className={styles.metricValue}>{formatarMoeda(metrics.totalAno)}</p>
          </div>

          <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <p className={styles.goalLabel} style={{ margin: 0 }}>
                Meta do mês
              </p>
              {!editandoMeta && (
                <button
                  type="button"
                  className={styles.goalEditButton}
                  onClick={iniciarEdicaoMeta}
                  aria-label="Editar meta"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>

            {editandoMeta ? (
              <div className={styles.goalEditForm}>
                <input
                  className={styles.goalEditInput}
                  inputMode="decimal"
                  autoFocus
                  value={novaMeta}
                  onChange={(event) => setNovaMeta(event.target.value)}
                  placeholder="Nova meta (R$)"
                />
                <button
                  type="button"
                  className={styles.goalEditConfirm}
                  onClick={salvarMeta}
                  disabled={salvandoMeta}
                  aria-label="Salvar meta"
                >
                  <Check size={16} />
                </button>
                <button
                  type="button"
                  className={styles.goalEditCancel}
                  onClick={() => setEditandoMeta(false)}
                  aria-label="Cancelar"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart
                  innerRadius="72%"
                  outerRadius="100%"
                  data={goalData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar dataKey="value" cornerRadius={20} background={{ fill: 'rgba(255,255,255,0.12)' }} />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={styles.goalPercent}
                  >
                    {Math.round(metaPercentual)}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            )}

            <div className={styles.goalFooter}>
              <div>
                <p className={styles.goalFooterLabel}>Meta</p>
                <p className={styles.goalFooterValue}>{formatarMoeda(metrics.meta)}</p>
              </div>
              <div>
                <p className={styles.goalFooterLabel}>Realizado</p>
                <p className={styles.goalFooterValue}>{formatarMoeda(metrics.real)}</p>
              </div>
            </div>
          </div>

          <div className={styles.tallCard}>
            <p className={styles.cardTitle}>Contatos</p>
            <p className={styles.cardHint}>{metrics.quantidadeContatos} cadastrados</p>
            <div className={styles.contactsList}>
              {contatos.map((contato) => (
                <div key={contato.id} className={styles.contactRow}>
                  <span>{contato.nome}</span>
                  <span>{contato.telefone}</span>
                </div>
              ))}
              {contatos.length === 0 && <p className={styles.emptyHint}>Nenhum contato ainda.</p>}
            </div>
          </div>

          <div className={styles.wideCard} style={{ gridColumn: 'span 2' }}>
            <p className={styles.cardTitle}>Análises por mês</p>
            <p className={styles.cardHint}>últimos {analisesSeries.length} meses</p>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={analisesSeries} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="analisesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0a2540" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0a2540" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#5b6674' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: '#0a2540', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#0a2540"
                  strokeWidth={2}
                  fill="url(#analisesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.wideCard} style={{ gridColumn: 'span 2' }}>
            <p className={styles.cardTitle}>Ligações por mês</p>
            <p className={styles.cardHint}>últimos {ligacoesSeries.length} meses</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={ligacoesSeries} margin={{ left: -20, right: 10 }}>
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#5b6674' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(244,185,66,0.15)' }} />
                <Bar dataKey="valor" fill="#f4b942" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
