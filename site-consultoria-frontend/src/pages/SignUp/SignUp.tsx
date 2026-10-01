import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../../services/auth';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import styles from '../../components/AuthLayout/AuthLayout.module.css';

export default function SignUp() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signUp({ nome, email, senha });
      navigate('/dashboard');
    } catch {
      setError('Não foi possível criar a conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Sign"
      subtitle="Seja bem vindo à sua plataforma de consultoria financeira"
    >
      <p className={styles.subtitle} style={{ marginTop: -32, marginBottom: 20 }}>
        Vamos começar!
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Nome completo"
            autoComplete="name"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="fulano@gmail.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="Digite sua senha..."
            autoComplete="new-password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.actions}>
          <Link to="/" className={styles.backLink}>
            Já tenho conta
          </Link>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
