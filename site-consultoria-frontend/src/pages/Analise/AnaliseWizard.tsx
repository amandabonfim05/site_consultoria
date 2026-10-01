import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmptyAnaliseData, type AnaliseWizardData } from '../../types/analise';
import { submeterAnalise } from '../../services/analise';
import { createContato } from '../../services/contacts';
import ObjetivosStep from './steps/ObjetivosStep';
import SituacaoProfissionalStep from './steps/SituacaoProfissionalStep';
import PatrimonioStep from './steps/PatrimonioStep';
import ProtecaoFinanceiraStep from './steps/ProtecaoFinanceiraStep';
import AposentadoriaStep from './steps/AposentadoriaStep';
import OrcamentoStep from './steps/OrcamentoStep';
import RecomendacaoStep from './steps/RecomendacaoStep';
import DiagnosticoStep from './steps/DiagnosticoStep';
import PlanoStep from './steps/PlanoStep';

const STEPS = [
  ObjetivosStep,
  SituacaoProfissionalStep,
  PatrimonioStep,
  ProtecaoFinanceiraStep,
  AposentadoriaStep,
  OrcamentoStep,
  RecomendacaoStep,
  DiagnosticoStep,
  PlanoStep,
];

async function salvarRecomendacoesComoContatos(data: AnaliseWizardData) {
  const validas = data.recomendacoes.filter((recomendacao) => recomendacao.nome.trim() !== '');

  await Promise.allSettled(
    validas.map((recomendacao) =>
      createContato({
        nome: recomendacao.nome,
        email: '',
        telefone: recomendacao.celular,
        profissao: recomendacao.profissao,
        indicadoPor: '',
        detalhes: [
          recomendacao.circuloSocial && `Círculo social: ${recomendacao.circuloSocial}`,
          recomendacao.estadoCivil && `Estado civil: ${recomendacao.estadoCivil}`,
          recomendacao.filhos && `Filhos: ${recomendacao.filhos}`,
          recomendacao.comentario,
        ]
          .filter(Boolean)
          .join(' · '),
      })
    )
  );
}

async function obterContatoDoCliente(data: AnaliseWizardData): Promise<string | undefined> {
  if (!data.nomeCliente.trim()) return undefined;

  try {
    const contato = await createContato({
      nome: data.nomeCliente,
      email: '',
      telefone: data.telefoneCliente,
      profissao: data.situacaoProfissional.profissao,
      indicadoPor: '',
      detalhes: 'Cliente da análise financeira',
    });
    return contato.id;
  } catch {
    return undefined;
  }
}

export default function AnaliseWizard() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState(createEmptyAnaliseData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const StepComponent = STEPS[stepIndex];

  function goBack() {
    setStepIndex((current) => Math.max(0, current - 1));
  }

  async function goNext(overrides?: Partial<AnaliseWizardData>) {
    const dadosAtualizados = overrides ? { ...data, ...overrides } : data;
    if (overrides) {
      setData(dadosAtualizados);
    }

    if (stepIndex < STEPS.length - 1) {
      setStepIndex((current) => current + 1);
      window.scrollTo({ top: 0 });
      return;
    }

    setIsSubmitting(true);
    try {
      const contatoId = await obterContatoDoCliente(dadosAtualizados);
      await submeterAnalise(dadosAtualizados, contatoId);
      await salvarRecomendacoesComoContatos(dadosAtualizados);
    } catch {

    } finally {
      setIsSubmitting(false);
      navigate('/dashboard');
    }
  }

  return (
    <StepComponent
      data={data}
      setData={setData}
      onBack={stepIndex === 0 ? undefined : goBack}
      onContinue={isSubmitting ? () => {} : goNext}
    />
  );
}
