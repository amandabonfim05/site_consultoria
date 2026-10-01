import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import ContatosList from './pages/Contatos/ContatosList';
import ContatoForm from './pages/Contatos/ContatoForm';
import UserForm from './pages/Configuracoes/UserForm';
import AnaliseWizard from './pages/Analise/AnaliseWizard';
import ContratosList from './pages/Contratos/ContratosList';
import ContratoDetalhe from './pages/Contratos/ContratoDetalhe';
import NovoContrato from './pages/Contratos/NovoContrato';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contatos"
          element={
            <ProtectedRoute>
              <ContatosList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contatos/novo"
          element={
            <ProtectedRoute>
              <ContatoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contatos/:id"
          element={
            <ProtectedRoute>
              <ContatoForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracoes"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analise"
          element={
            <ProtectedRoute>
              <AnaliseWizard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contratos"
          element={
            <ProtectedRoute>
              <ContratosList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contratos/novo"
          element={
            <ProtectedRoute>
              <NovoContrato />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contratos/:id"
          element={
            <ProtectedRoute>
              <ContratoDetalhe />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
