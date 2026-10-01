import type { Dispatch, SetStateAction } from 'react';
import type { AnaliseWizardData } from '../../types/analise';

export interface StepProps {
  data: AnaliseWizardData;
  setData: Dispatch<SetStateAction<AnaliseWizardData>>;
  onBack?: () => void;
  onContinue: (overrides?: Partial<AnaliseWizardData>) => void;
}
