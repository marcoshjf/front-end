import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/administrador.css";

interface Barbeiro {
  valorTotal: number;
  valorServicos: number;
  valorProdutos: number;
  valorGeladeira: number;
}

interface LocationState {
  barbeiros: Barbeiro[];
}

const Administrador: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const initialBarbeiros = state?.barbeiros || [];
 
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>(() => {
    const savedBarbeiros = localStorage.getItem('barbeiros');
    return savedBarbeiros ? JSON.parse(savedBarbeiros) : initialBarbeiros;
  });

  useEffect(() => {
    localStorage.setItem('barbeiros', JSON.stringify(barbeiros));
  }, [barbeiros]);

  const handleLoginClick = () => {
    navigate("/");
  };

  const handleEstoqueClick = () => {
    navigate('/estoque_item');
  };

  const handleVendasClick = () => {
    navigate('/cadastro_vendas');
  };

  const handleFluxoClick = () => {
    navigate('/fluxo_caixa');
  };

  const handleResetClick = () => {
    const servicos = barbeiros.reduce((acc, barbeiro) => acc + barbeiro.valorServicos, 0);
    const geladeira = barbeiros.reduce((acc, barbeiro) => acc + barbeiro.valorProdutos + barbeiro.valorGeladeira, 0);

    const savedServicos = localStorage.getItem('servicos');
    const savedGeladeira = localStorage.getItem('geladeira');

    const newServicos = savedServicos ? JSON.parse(savedServicos) + servicos : servicos;
    const newGeladeira = savedGeladeira ? JSON.parse(savedGeladeira) + geladeira : geladeira;

    localStorage.setItem('servicos', JSON.stringify(newServicos));
    localStorage.setItem('geladeira', JSON.stringify(newGeladeira));
    localStorage.removeItem('barbeiros');
    setBarbeiros([]);
  };

  const handleCadastroFuncionarioClick = () => {
    navigate('/cadFunc');
  };

  return (
    <div>
      <header className="cabeçalho">
        <div className="container">
          <h1 className="logo">proBARBER</h1>
          <a href="#" onClick={handleLoginClick}>
            <img src="public/assets/TESOURA.png" alt="Cadastrar barbeiro" className="container__imagem-tesoura" />
          </a>
          <input type="checkbox" id="menu" className="container__botao" />
          <label htmlFor="menu">
            <span className="cabeçalho__menu-hamburguer container__imagem"></span>
          </label>
        </div>
      </header>

      <section className="adm_vendas">
        {barbeiros.length > 0 ? (
          barbeiros.map((barbeiro, index) => (
            <div key={index} className="barbeiro">
              <h2 className="adm-titulo">{`BARBEIRO ${index + 1}`}</h2>
              <p className="corte">
                <u>Corte: {`R$ ${barbeiro.valorServicos.toFixed(2)}`}</u>
              </p>
              <p className="venda">
                <u>Venda: {`R$ ${(barbeiro.valorProdutos + barbeiro.valorGeladeira).toFixed(2)}`}</u>
              </p>
              <p className="lucrando">
                <u>Lucrando: {`R$ ${barbeiro.valorTotal.toFixed(2)}`}</u>
              </p>
            </div>
          ))
        ) : (
          <p>Nenhum barbeiro cadastrado.</p>
        )}
      </section>

      <footer className="rodape">
        <div className="container__rodape">
          <a href="#" className="container__func">
            <img src="public/assets/icones/funcionario(roxo).jpg" alt="funcionario" className="container__img-rodape" />
          </a>
          <div className="container__caixa" onClick={handleFluxoClick} role="button" tabIndex={0}>
            <img src="public/assets/icones/fluxo caixa(branco).png" alt="Carrinhos de compras" className="container__img-rodape" />
          </div>
          <div className="container__estoque" onClick={handleEstoqueClick} role="button" tabIndex={0}>
            <img src="public/assets/icones/estoque(branco).png" alt="estoque" className="container__img-rodape" />
          </div>
          <div className="container__cadastro" onClick={handleVendasClick} role="button" tabIndex={0}>
            <img src="public/assets/icones/cadastro(branco).png" alt="Cadastro" className="container__img-rodape" />
          </div>
          <div className="container__reset" onClick={handleResetClick} role="button" tabIndex={0}>
            <img src="public/assets/icones/reset(branco).png" alt="Resetar" className="container__img-rodape" />
          </div>
          <div className="container__cadastro-funcionario" onClick={handleCadastroFuncionarioClick} role="button" tabIndex={0}>
            <img src="public/assets/icones/cadastro_funcionario.png" alt="Cadastro de Funcionário" className="container__img-rodape" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Administrador;
