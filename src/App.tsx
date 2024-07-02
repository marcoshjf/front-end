import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './router/Home';
import Cadastro_vendas from './router/cadastro_vendas';
import Estoque from './router/estoque_item';
import Administrador from './components/administrador';
import Fluxo from './components/fluxo';
import CadastroFuncionario from './components/cadastro_func';



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/cadFunc" element={<CadastroFuncionario />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cadastro-vendas" element={<Cadastro_vendas />}/>
        <Route path="/estoque_item" element={<Estoque />} />
        <Route path="/fluxo_caixa" element={<Fluxo />} />
        <Route path="/adm_user" element={<Administrador />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;
