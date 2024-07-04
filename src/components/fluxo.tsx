import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/fluxo.css";

const Fluxo: React.FC = () => {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<number>(0);
  const [geladeira, setGeladeira] = useState<number>(0);

  useEffect(() => {
    const savedServicos = localStorage.getItem('servicos');
    const savedGeladeira = localStorage.getItem('geladeira');
    
    if (savedServicos) {
      setServicos(JSON.parse(savedServicos));
    }
    if (savedGeladeira) {
      setGeladeira(JSON.parse(savedGeladeira));
    }
  }, []);

  const handleResetClick = () => {
    setServicos(0);
    setGeladeira(0);
    localStorage.setItem('servicos', '0');
    localStorage.setItem('geladeira', '0');
  };

  const handleLoginClick = () => {
    navigate("/");
  };

  const handleEstoqueClick = () => {
    navigate('/estoque_item');
  };

  const handleVendasClick = () => {
    navigate('/cadastro_vendas');
  };

  const handleAdmClick = () => {
    navigate('/adm_user');
  };

  return (
    <div className="fluxo-container">
      <header className="cabecalho">
        <div className="container">
          <h1 className="logo">proBARBER</h1>
          <a href="#" onClick={handleLoginClick}>
            <img
              src="assets/TESOURA.png"
              alt="Cadastrar barbeiro"
              className="container__imagem-tesoura"
            />
          </a>
        </div>
        <input type="checkbox" id="menu" className="container__botao" />
        <label htmlFor="menu">
          <span className="cabecalho__menu-hamburguer container__imagem"></span>
        </label>
      </header>

      <div className="corpo">
        <div className="titulo">
          <h1>Fluxo de Caixa Mensal</h1>
        </div>

        <section className="menu-section">
          <div className="menu">
            <h2>Serviços</h2>
            <table>
              <tbody>
                <tr>
                  <td>Total</td>
                  <td>{`R$ ${servicos.toFixed(2)}`}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="menu-section">
          <div className="menu">
            <h2>Produtos</h2>
            <table>
              <tbody>
                <tr>
                  <td>Total</td>
                  <td>{`R$ ${geladeira.toFixed(2)}`}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <button className="reset-button" onClick={handleResetClick}>Resetar Fluxo</button>

        <footer className="rodape">
          <div className="container__rodape">
            <div
              className="container__funcionario"
              onClick={handleAdmClick}
              role="button"
              tabIndex={0}
            >
              <img
                src="public/assets/icones/funcionario(branco).jpg"
                alt="funcionario"
                className="container__img-rodape"
              />
            </div>
            <div className="container__caixa-fluxo">
              <a href="#">
                <img
                  src="public/assets/icones/fluxo caixa(roxo).png"
                  alt="fluxo caixa"
                  className="container__img-rodape"
                />
              </a>
            </div>
            <div
              className="container__estoque"
              onClick={handleEstoqueClick}
              role="button"
              tabIndex={0}
            >
              <img
                src="public/assets/icones/estoque(branco).png"
                alt="estoque"
                className="container__img-rodape"
              />
            </div>
            <div
              className="container__cadastro"
              onClick={handleVendasClick}
              role="button"
              tabIndex={0}
            >
              <img
                src="public/assets/icones/cadastro(branco).png"
                alt="Cadastro"
                className="container__img-rodape"
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Fluxo;
