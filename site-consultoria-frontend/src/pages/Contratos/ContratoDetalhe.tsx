import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../components/AppLayout/AppLayout';
import { cancelarContratoAssinado, getContratoDetalhe } from '../../services/contratosAssinados';
import type { Contrato } from '../../types/contrato';
import styles from './Contratos.module.css';

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR');
}

export default function ContratoDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelando, setCancelando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getContratoDetalhe(id)
      .then(setContrato)
      .catch(() => setError('Não foi possível carregar este contrato.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleCancelar() {
    if (!id) return;
    const confirmou = window.confirm(
      'Cancelar este contrato? O valor dele sai do total do consultor e não pode ser desfeito.'
    );
    if (!confirmou) return;

    setCancelando(true);
    setError(null);
    try {
      await cancelarContratoAssinado(id);
      navigate('/contratos');
    } catch {
      setError('Não foi possível cancelar o contrato. Tente novamente.');
      setCancelando(false);
    }
  }

  return (
    <AppLayout title="Contratos">
      {isLoading && <p>Carregando...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {contrato && (
        <div className={styles.detailCard}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Nome</span>
            <span className={styles.detailValue}>{contrato.contato.nome}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Telefone</span>
            <span className={styles.detailValue}>{contrato.contato.telefone}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Profissão</span>
            <span className={styles.detailValue}>{contrato.contato.profissao || '—'}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Valor do contrato</span>
            <span className={styles.detailValue}>{formatarMoeda(contrato.valor)}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Fechado em</span>
            <span className={styles.detailValue}>{formatarData(contrato.fechadoEm)}</span>
          </div>

          <button
            type="button"
            className={styles.cancelButton}
            disabled={cancelando}
            onClick={handleCancelar}
          >
            {cancelando ? 'Cancelando...' : 'Cancelar contrato'}
          </button>
        </div>
      )}
    </AppLayout>
  );
}
