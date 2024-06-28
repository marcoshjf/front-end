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
import Servico from './router/outlet_serv';
import Produto from './router/outlet_prod.tsx';
import Geladeira from './router/outlet_serv.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "cadastro_vendas",
    element: <CadVendas />,
    children: [
      {
        path: "servico",
        element: <Servico />,
      },
      {
        path: "produto",
        element: <Produto />,
      },
      {
        path: "geladeira",
        element: <Geladeira />,
      },
    ],
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
