import styles from './WizardLayout.module.css';
import CampoMoeda from './CampoMoeda';
import { paraNumero } from '../../utils/moeda';

interface CategoryTableProps {
  categorias: string[];
  values: Record<string, string>;
  onChange: (categoria: string, value: string) => void;
}

export default function CategoryTable({ categorias, values, onChange }: CategoryTableProps) {
  const total = categorias.reduce((sum, categoria) => sum + paraNumero(values[categoria] ?? ''), 0);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Categoria</th>
          <th>Valor (R$)</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((categoria) => (
          <tr key={categoria}>
            <td>{categoria}</td>
            <td>
              <CampoMoeda
                placeholder="0,00"
                value={values[categoria] ?? ''}
                onChange={(value) => onChange(categoria, value)}
              />
            </td>
          </tr>
        ))}
        <tr className={styles.tableTotal}>
          <td>Total</td>
          <td>R$ {total.toFixed(2).replace('.', ',')}</td>
        </tr>
      </tbody>
    </table>
  );
}