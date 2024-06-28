import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/cadVendas.css';

interface SelectedItems {
  Servicos: { [key: string]: boolean };
  Produtos: { [key: string]: boolean };
  Geladeira: { [key: string]: boolean };
}

interface Precos {
  [key: string]: number;
}

const CadVendas: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState<{ [key: number]: boolean }>({});
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    Servicos: {
      Corte: false,
      Nevou: false,
      Barba: false,
      Bigode: false,
    },
    Produtos: {
      Cerveja1: false,
      Cerveja2: false,
      "Agua s/ Gás": false,
      "Agua c/ Gás": false,
      Lata1: false,
      Lata2: false,
      Achocolatado: false,
    },
    Geladeira: {
      Cerveja1: false,
      Cerveja2: false,
      "Agua s/ Gás": false,
      "Agua c/ Gás": false,
      Lata1: false,
      Lata2: false,
      Achocolatado: false,
    }
  });

  const [precos, setPrecos] = useState<Precos>(() => {
    const savedPrecos = localStorage.getItem('precos');
    return savedPrecos ? JSON.parse(savedPrecos) : {};
  });
  const [valorTotal, setValorTotal] = useState<number>(0);
  const [valorServicos, setValorServicos] = useState<number>(0);
  const [valorProdutos, setValorProdutos] = useState<number>(0);
  const [valorGeladeira, setValorGeladeira] = useState<number>(0);

  const handleLoginClick = () => {
    navigate("/");
  };

  const handleConfirm = () => {
    const newBarbeiro = {
      valorTotal,
      valorServicos,
      valorProdutos,
      valorGeladeira,
    };
    const barbeiros = JSON.parse(localStorage.getItem('barbeiros') || '[]');
    barbeiros.push(newBarbeiro);
    localStorage.setItem('barbeiros', JSON.stringify(barbeiros));
    navigate("/adm_user", {
      state: { barbeiros },
    });
  };

  const handleCancel = () => {
    navigate('/');
  };

  const toggleMenu = (menuId: number) => {
    setMenuOpen(prevState => ({
      ...prevState,
      [menuId]: !prevState[menuId]
    }));
  };

  const handleCheckboxChange = (section: keyof SelectedItems, itemName: string) => {
    setSelectedItems(prevState => {
      const updatedSection = {
        ...prevState[section],
        [itemName]: !prevState[section][itemName]
      };
      return {
        ...prevState,
        [section]: updatedSection
      };
    });
  };

  const handlePriceChange = (itemName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setPrecos(prevState => {
        const updatedPrecos = {
          ...prevState,
          [itemName]: value
        };
        localStorage.setItem('precos', JSON.stringify(updatedPrecos));
        return updatedPrecos;
      });
    }
  };

  useEffect(() => {
    const totalServicos = Object.keys(selectedItems.Servicos).reduce((acc, item) => {
      if (selectedItems.Servicos[item]) {
        return acc + (precos[item] || 0);
      }
      return acc;
    }, 0);

    const totalProdutos = Object.keys(selectedItems.Produtos).reduce((acc, item) => {
      if (selectedItems.Produtos[item]) {
        return acc + (precos[item] || 0);
      }
      return acc;
    }, 0);

    const totalGeladeira = Object.keys(selectedItems.Geladeira).reduce((acc, item) => {
      if (selectedItems.Geladeira[item]) {
        return acc + (precos[item] || 0);
      }
      return acc;
    }, 0);

    const total = totalServicos + totalProdutos + totalGeladeira;

    setValorServicos(totalServicos);
    setValorProdutos(totalProdutos);
    setValorGeladeira(totalGeladeira);
    setValorTotal(total);
  }, [selectedItems, precos]);

  return (
    <div>
      <header className="cabecalho">
        <div className="container">
          <h1 className="logo">proBARBER</h1>
          <a href="#" onClick={handleLoginClick}>
            <img src="/assets/TESOURA.png" alt="Cadastrar barbeiro" className="container__imagem-tesoura" />
          </a>
          <input type="checkbox" id="menu" className="container__botao" />
          <label htmlFor="menu">
            <span className="cabecalho__menu-hamburguer container__imagem"></span>
          </label>
        </div>
      </header>
      <section className="banner">
        <h2 className="banner__titulo">CADASTRAR VENDAS</h2>
      </section>
      <section className="valor">
        <p className="banner__valor">Valor Recebido:</p>
        <input
          type="text"
          className="banner__valores"
          value={`R$ ${valorTotal.toFixed(2)}`}
          readOnly
        />
      </section>
      <section className="servico">
        <h2 className="carrossel_serv">Serviços</h2>
        <img
          src="/assets/botao mais.png"
          alt="botão mais Serviço"
          className={`menu ${isMenuOpen[1] ? 'aberto' : ''}`}
          onClick={() => toggleMenu(1)}
        />
        {isMenuOpen[1] && (
          <div className="section-content">
            {Object.keys(selectedItems.Servicos).map(item => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={selectedItems.Servicos[item]}
                  onChange={() => handleCheckboxChange('Servicos', item)}
                />
                {item}
                <input
                  type="number"
                  placeholder="Preço"
                  value={precos[item] || ''}
                  onChange={(e) => handlePriceChange(item, e)}
                />
              </label>
            ))}
          </div>
        )}
      </section>
      <section className="produto">
        <h2 className="carrossel_prod">Produtos</h2>
        <img
          src="/assets/botao mais.png"
          alt="botão mais Produto"
          className={`menu ${isMenuOpen[2] ? 'aberto' : ''}`}
          onClick={() => toggleMenu(2)}
        />
        {isMenuOpen[2] && (
          <div className="section-content">
            {Object.keys(selectedItems.Produtos).map(item => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={selectedItems.Produtos[item]}
                  onChange={() => handleCheckboxChange('Produtos', item)}
                />
                {item}
                <input
                  type="number"
                  placeholder="Preço"
                  value={precos[item] || ''}
                  onChange={(e) => handlePriceChange(item, e)}
                />
              </label>
            ))}
          </div>
        )}
      </section>
      <section className="geladeira">
        <h2 className="carrossel_gela">Geladeira</h2>
        <img
          src="/assets/botao mais.png"
          alt="botão mais Geladeira"
          className={`menu ${isMenuOpen[3] ? 'aberto' : ''}`}
          onClick={() => toggleMenu(3)}
        />
        {isMenuOpen[3] && (
          <div className="section-content">
            {Object.keys(selectedItems.Geladeira).map(item => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={selectedItems.Geladeira[item]}
                  onChange={() => handleCheckboxChange('Geladeira', item)}
                />
                {item}
                <input
                  type="number"
                  placeholder="Preço"
                  value={precos[item] || ''}
                  onChange={(e) => handlePriceChange(item, e)}
                />
              </label>
            ))}
          </div>
        )}
      </section>
      <footer className="botoes">
        <input type="button" value="Cancelar" className="cancelar" onClick={handleCancel} />
        <input type="button" value="Confirmar" className="confirmar" onClick={handleConfirm} />
      </footer>
    </div>
  );
};

export default CadVendas;