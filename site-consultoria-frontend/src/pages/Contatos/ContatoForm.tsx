import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../components/AppLayout/AppLayout';
import { createContato, getContato, listContatos, updateContato } from '../../services/contacts';
import type { ContatoPayload } from '../../types/contact';
import styles from './ContatoForm.module.css';

const initialState: ContatoPayload = {
  nome: '',
  email: '',
  telefone: '',
  dataNascimento: '',
  profissao: '',
  indicadoPor: '',
  detalhes: '',
};

export default function ContatoForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<ContatoPayload>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numeroContato, setNumeroContato] = useState(1);

  useEffect(() => {
    if (!id) return;

    getContato(id)
      .then((contato) => {
        const { id: _ignored, ...rest } = contato;
        setForm(rest);
      })
      .catch(() => setError('Não foi possível carregar este contato.'));
  }, [id]);

  useEffect(() => {
    listContatos()
      .then((lista) => {
        if (id) {
          const posicao = lista.findIndex((contato) => contato.id === id);
          setNumeroContato(posicao >= 0 ? posicao + 1 : lista.length);
        } else {
          setNumeroContato(lista.length + 1);
        }
      })
      .catch(() => {
              });
  }, [id]);

  function handleChange<K extends keyof ContatoPayload>(field: K, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditing && id) {
        await updateContato(id, form);
      } else {
        await createContato(form);
      }
      navigate('/contatos');
    } catch {
      setError('Não foi possível salvar o contato. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppLayout>
      <div className={styles.badge}>
        <span className={styles.badgeNumber}>{numeroContato}</span>
        <span className={styles.badgeLabel}>{isEditing ? 'Editar contato' : 'Novo contato'}</span>
      </div>

      <h2 className={styles.formTitle}>Cadastro Contato</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="nome">Nome do contato</label>
            <input
              id="nome"
              value={form.nome}
              onChange={(event) => handleChange('nome', event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="indicadoPor">Nome de quem indicou</label>
            <input
              id="indicadoPor"
              value={form.indicadoPor}
              onChange={(event) => handleChange('indicadoPor', event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="dataNascimento">Data de nascimento</label>
            <input
              id="dataNascimento"
              type="date"
              value={form.dataNascimento}
              onChange={(event) => handleChange('dataNascimento', event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="profissao">Profissão</label>
            <input
              id="profissao"
              value={form.profissao}
              onChange={(event) => handleChange('profissao', event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="telefone">Telefone de contato</label>
            <input
              id="telefone"
              placeholder="(XX) x xxxx-xxxx"
              value={form.telefone}
              onChange={(event) => handleChange('telefone', event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email de contato</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              required
            />
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label htmlFor="detalhes">Detalhes</label>
            <textarea
              id="detalhes"
              value={form.detalhes}
              onChange={(event) => handleChange('detalhes', event.target.value)}
            />
          </div>
        </div>

        <div className={styles.actions}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar →'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
