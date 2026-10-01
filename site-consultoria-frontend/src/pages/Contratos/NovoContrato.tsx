import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout/AppLayout';
import { listContatos } from '../../services/contacts';
import { createContratoAssinado } from '../../services/contratosAssinados';
import type { Contato } from '../../types/contact';
import formStyles from '../Contatos/ContatoForm.module.css';

export default function NovoContrato() {
  const navigate = useNavigate();
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [contatoId, setContatoId] = useState('');
  const [valor, setValor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listContatos()
      .then(setContatos)
      .catch(() => setError('Não foi possível carregar os contatos.'));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const valorNumerico = Number(valor.replace(',', '.'));
    if (!contatoId || Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      setError('Selecione um contato e informe um valor válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createContratoAssinado({ contatoId, valor: valorNumerico });
      navigate('/contratos');
    } catch {
      setError('Não foi possível salvar o contrato. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppLayout title="Novo contrato">
      <form onSubmit={handleSubmit}>
        <div className={formStyles.grid} style={{ gridTemplateColumns: '1fr' }}>
          <div className={formStyles.field}>
            <label htmlFor="contato">Contato</label>
            <select
              id="contato"
              value={contatoId}
              onChange={(event) => setContatoId(event.target.value)}
              style={{
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--slate-100)',
                borderRadius: 'var(--radius-sm)',
                padding: '9px 12px',
                fontSize: 13,
              }}
            >
              <option value="">Selecione um contato...</option>
              {contatos.map((contato) => (
                <option key={contato.id} value={contato.id}>
                  {contato.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={formStyles.field}>
            <label htmlFor="valor">Valor do contrato</label>
            <input
              id="valor"
              inputMode="decimal"
              placeholder="R$ 0,00"
              value={valor}
              onChange={(event) => setValor(event.target.value)}
            />
          </div>
        </div>

        <div className={formStyles.actions}>
          {error && <p className={formStyles.errorMessage}>{error}</p>}
          <button type="submit" className={formStyles.saveButton} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar →'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
