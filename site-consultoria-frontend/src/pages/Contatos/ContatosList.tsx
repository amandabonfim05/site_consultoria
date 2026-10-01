import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout/AppLayout';
import { listContatos } from '../../services/contacts';
import { confirmarLigacao } from '../../services/ligacoes';
import type { Contato } from '../../types/contact';
import styles from './Contatos.module.css';

export default function ContatosList() {
  const navigate = useNavigate();
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmados, setConfirmados] = useState<Set<string>>(new Set());
  const [enviandoId, setEnviandoId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listContatos()
      .then((data) => {
        if (active) setContatos(data);
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar os contatos.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleConfirmarLigacao(id: string) {
    setEnviandoId(id);
    try {
      await confirmarLigacao();
      setConfirmados((prev) => new Set(prev).add(id));
    } catch {

    } finally {
      setEnviandoId(null);
    }
  }

  return (
    <AppLayout title="Contatos">
      {isLoading && <p>Carregando contatos...</p>}
      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <div className={styles.list}>
          {contatos.length === 0 && (
            <p className={styles.emptyState}>Nenhum contato cadastrado ainda.</p>
          )}

          {contatos.map((contato) => {
            const jaConfirmado = confirmados.has(contato.id);
            return (
              <div key={contato.id} className={styles.row}>
                <button
                  type="button"
                  className={styles.rowContent}
                  onClick={() => navigate(`/contatos/${contato.id}`)}
                >
                  <p className={styles.rowName}>{contato.nome}</p>
                  <p className={styles.rowMeta}>{contato.email}</p>
                  <p className={styles.rowMetaSmall}>{contato.telefone}</p>
                </button>

                <button
                  type="button"
                  className={`${styles.ligacaoButton} ${jaConfirmado ? styles.ligacaoButtonDone : ''}`}
                  disabled={jaConfirmado || enviandoId === contato.id}
                  onClick={() => handleConfirmarLigacao(contato.id)}
                >
                  {jaConfirmado ? '✓ Ligação confirmada' : 'Confirmar ligação'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => navigate('/contatos/novo')}
        >
          Adicionar
        </button>
      </div>
    </AppLayout>
  );
}
