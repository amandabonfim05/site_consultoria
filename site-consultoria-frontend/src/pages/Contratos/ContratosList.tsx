import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout/AppLayout';
import { listContratos } from '../../services/contratosAssinados';
import type { Contrato } from '../../types/contrato';
import styles from './Contratos.module.css';

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ContratosList() {
  const navigate = useNavigate();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listContratos()
      .then((data) => {
        if (active) setContratos(data);
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar os contratos.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <AppLayout title="Contratos">
      {isLoading && <p>Carregando contratos...</p>}
      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <div className={styles.list}>
          {contratos.length === 0 && (
            <p className={styles.emptyState}>Nenhum contrato assinado ainda.</p>
          )}

          {contratos.map((contrato) => (
            <button
              key={contrato.id}
              type="button"
              className={styles.row}
              onClick={() => navigate(`/contratos/${contrato.id}`)}
            >
              <div className={styles.rowTop}>
                <p className={styles.rowName}>{contrato.contato.nome}</p>
                <span className={styles.rowValor}>{formatarMoeda(contrato.valor)}</span>
              </div>
              <p className={styles.rowMeta}>{contrato.contato.telefone}</p>
            </button>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => navigate('/contratos/novo')}
        >
          Adicionar
        </button>
      </div>
    </AppLayout>
  );
}
