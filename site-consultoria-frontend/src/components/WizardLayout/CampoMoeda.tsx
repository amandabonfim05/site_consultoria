import { formatarEntradaMoeda } from '../../utils/moeda';

interface CampoMoedaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CampoMoeda({ id, value, onChange, placeholder = 'R$ 0,00' }: CampoMoedaProps) {
  return (
    <input
      id={id}
      inputMode="decimal"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(formatarEntradaMoeda(event.target.value))}
    />
  );
}