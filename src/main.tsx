import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// pages
import Home from './router/Home';
import CadVendas from './router/cadastro_vendas';
import Estoque from './router/estoque_item.tsx';
import Administrador from './router/adm_user';
import Fluxo from './router/fluxo_caixa.tsx';
import CadastroFuncionario from './components/cadastro_func.tsx';

const router = createBrowserRouter([
  {
    path: "/cadFunc",
    element: <CadastroFuncionario />,
  },
  {
    path: "/",
    element: <Home />,
  },
  
  {
    path: "cadastro_vendas",
    element: <CadVendas />,
  },
  {
    path: "estoque_item",
    element: <Estoque />,
  },
  {
    path: "adm_user",
    element: <Administrador />,
  },
  {
    path: "fluxo_caixa",
    element: <Fluxo />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
