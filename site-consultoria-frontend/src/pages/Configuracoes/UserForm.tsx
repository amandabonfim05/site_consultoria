import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout/AppLayout';
import { getMe, updateMe } from '../../services/user';
import type { UserProfile } from '../../types/user';
import styles from '../Contatos/ContatoForm.module.css';

const initialState: UserProfile = {
  nome: '',
  email: '',
  telefone: '',
  dataNascimento: '',
};

export default function UserForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<UserProfile>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then(setForm)
      .catch(() => setError('Não foi possível carregar seu perfil.'));
  }, []);

  function handleChange<K extends keyof UserProfile>(field: K, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await updateMe(form);
      navigate('/dashboard');
    } catch {
      setError('Não foi possível salvar suas informações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppLayout>
      <div className={styles.badge}>
        <span className={styles.badgeNumber}>1</span>
        <span className={styles.badgeLabel}>Nome user</span>
      </div>

      <h2 className={styles.formTitle}>Cadastro User</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              value={form.nome}
              onChange={(event) => handleChange('nome', event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              required
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
            <label htmlFor="telefone">Telefone de contato</label>
            <input
              id="telefone"
              placeholder="(XX) x xxxx-xxxx"
              value={form.telefone}
              onChange={(event) => handleChange('telefone', event.target.value)}
            />
          </div>
        </div>

        <div className={styles.actions}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Voltar →'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
