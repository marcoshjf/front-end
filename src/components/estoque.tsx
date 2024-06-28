import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/estoque.css";

interface EstoqueState {
  cerveja1: number;
  cerveja2: number;
  aguaSGas: number;
  aguaCGas: number;
  lata1: number;
  lata2: number;
  achocolatado: number;
}

const Estoque: React.FC = () => {
  const navigate = useNavigate();

  const [estoque, setEstoque] = useState<EstoqueState>(() => {
    const savedEstoque = localStorage.getItem('estoque');
    return savedEstoque ? JSON.parse(savedEstoque) : {
      cerveja1: 0,
      cerveja2: 0,
      aguaSGas: 0,
      aguaCGas: 0,
      lata1: 0,
      lata2: 0,
      achocolatado: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('estoque', JSON.stringify(estoque));
  }, [estoque]);

  const handleLoginClick = () => {
    navigate("/");
  };

  const handleAdmClick = () => {
    navigate('/adm_user');
  };

  const handleVendasClick = () => {
    navigate('/cadastro_vendas');
  };

  const handleFluxoClick = () => {
    navigate('/fluxo_caixa');
  };

  const updateEstoque = (name: keyof EstoqueState, value: number) => {
    setEstoque(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleInputChange = (itemName: keyof EstoqueState, event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      updateEstoque(itemName, parsedValue);
    }
  };

  const increment = (itemName: keyof EstoqueState) => {
    setEstoque(prevState => ({
      ...prevState,
      [itemName]: prevState[itemName] + 1
    }));
  };

  const decrement = (itemName: keyof EstoqueState) => {
    setEstoque(prevState => ({
      ...prevState,
      [itemName]: prevState[itemName] > 0 ? prevState[itemName] - 1 : 0
    }));
  };

  return (
    <div>
      <header className="cabecalho">
        <div className="container">
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
        </div>
      </header>

      <section className="estoque">
        <h2 className="estoque-titulo">ESTOQUE</h2>
        <h2 className="estoque-sub">Geladeira</h2>
        <div className="item-list">
          {Object.keys(estoque).map((item) => (
            <div className="item" key={item}>
              <span>{item}</span>
              <div className="controls">
                <button onClick={() => decrement(item as keyof EstoqueState)}>-</button>
                <input
                  type="number"
                  value={estoque[item as keyof EstoqueState]}
                  onChange={(e) => handleInputChange(item as keyof EstoqueState, e)}
                />
                <button onClick={() => increment(item as keyof EstoqueState)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="rodape">
        <div className="container__rodape">
          <div
            className="container__funcionario"
            onClick={handleAdmClick}
            role="button"
            tabIndex={0}
          >
            <img
              src="assets/icones/funcionario(branco).jpg"
              alt="funcionario"
              className="container__img-rodape"
            />
          </div>
          <div
            className="container__caixa-estoque"
            onClick={handleFluxoClick}
            role="button"
            tabIndex={0}
          >
            <img
              src="assets/icones/fluxo caixa(branco).png"
              alt="fluxo caixa"
              className="container__img-rodape"
            />
          </div>
          <a href="#" className="container__estoque-rel">
            <img
              src="assets/icones/estoque(roxo).png"
              alt="estoque"
              className="container__img-rodape"
            />
          </a>
          <div
            className="container__cadastro"
            onClick={handleVendasClick}
            role="button"
            tabIndex={0}
          >
            <img
              src="assets/icones/cadastro(branco).png"
              alt="Cadastro"
              className="container__img-rodape"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Estoque;
