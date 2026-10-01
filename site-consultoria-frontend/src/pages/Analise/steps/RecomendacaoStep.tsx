import WizardLayout from '../../../components/WizardLayout/WizardLayout';
import StepFooter from '../../../components/WizardLayout/StepFooter';
import styles from '../../../components/WizardLayout/WizardLayout.module.css';
import type { Recomendacao } from '../../../types/analise';
import type { StepProps } from '../wizardTypes';

function criarRecomendacao(): Recomendacao {
  return {
    id: `recomendacao-${Date.now()}`,
    nome: '',
    celular: '',
    genero: '',
    circuloSocial: '',
    estadoCivil: '',
    filhos: '',
    profissao: '',
    comentario: '',
  };
}

export default function RecomendacaoStep({ data, setData, onBack, onContinue }: StepProps) {
  const recomendacoes = data.recomendacoes.length ? data.recomendacoes : [criarRecomendacao()];

  function updateRecomendacao(id: string, field: keyof Recomendacao, value: string) {
    setData((prev) => {
      const lista = prev.recomendacoes.length ? prev.recomendacoes : [criarRecomendacao()];
      return {
        ...prev,
        recomendacoes: lista.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      };
    });
  }

  function addRecomendacao() {
    setData((prev) => ({
      ...prev,
      recomendacoes: [...(prev.recomendacoes.length ? prev.recomendacoes : [criarRecomendacao()]), criarRecomendacao()],
    }));
  }

  function removeRecomendacao(id: string) {
    setData((prev) => ({
      ...prev,
      recomendacoes: prev.recomendacoes.filter((item) => item.id !== id),
    }));
  }

  return (
    <WizardLayout stepIndex={6} title="Recomendação" subtitle="Ajude seus amigos e familiares a conquistarem seus sonhos!">
      {recomendacoes.map((recomendacao) => (
        <div key={recomendacao.id} className={styles.card}>
          {recomendacoes.length > 1 && (
            <div className={styles.cardHeader}>
              <span />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeRecomendacao(recomendacao.id)}
              >
                Remover
              </button>
            </div>
          )}
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label>Nome</label>
              <input
                value={recomendacao.nome}
                onChange={(event) => updateRecomendacao(recomendacao.id, 'nome', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Celular</label>
              <input
                value={recomendacao.celular}
                onChange={(event) => updateRecomendacao(recomendacao.id, 'celular', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Gênero</label>
              <input
                value={recomendacao.genero}
                onChange={(event) => updateRecomendacao(recomendacao.id, 'genero', event.target.value)}
              />
            </div>
          </div>
          <div className={styles.grid3} style={{ marginTop: 12 }}>
            <div className={styles.field}>
              <label>Círculo social</label>
              <input
                value={recomendacao.circuloSocial}
                onChange={(event) => updateRecomendacao(recomendacao.id, 'circuloSocial', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Estado civil</label>
              <input
                value={recomendacao.estadoCivil}
                onChange={(event) => updateRecomendacao(recomendacao.id, 'estadoCivil', event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Filhos</label>
              <input
                value={recomendacao.filhos}
                onChange={(event) => updateRecomendacao(recomendacao.id, 'filhos', event.target.value)}
              />
            </div>
          </div>
          <div className={styles.field} style={{ marginTop: 12 }}>
            <label>Profissão</label>
            <input
              value={recomendacao.profissao}
              onChange={(event) => updateRecomendacao(recomendacao.id, 'profissao', event.target.value)}
            />
          </div>
          <div className={styles.field} style={{ marginTop: 12 }}>
            <label>Comentário</label>
            <textarea
              value={recomendacao.comentario}
              onChange={(event) => updateRecomendacao(recomendacao.id, 'comentario', event.target.value)}
            />
          </div>
        </div>
      ))}

      <button type="button" className={styles.addButton} onClick={addRecomendacao}>
        + Adicionar outra recomendação
      </button>

      <StepFooter onBack={onBack} onContinue={onContinue} />
    </WizardLayout>
  );
}
