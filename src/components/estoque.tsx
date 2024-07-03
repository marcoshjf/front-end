import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/estoque.css";

interface EstoqueState {
  [key: string]: number;
}

interface Item {
  id: string;
  nomeProduto: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  categoria: string;
  imagemProduto: string | null;
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

  const [newItemDetails, setNewItemDetails] = useState({
    nomeProduto: '',
    descricao: '',
    preco: '',
    quantidadeEstoque: '',
    categoria: '',
    imagemProduto: null
  });

  const [items, setItems] = useState<Item[]>([]);

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

  const handleDetailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewItemDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddItemToAPI = async () => {
    try {
      const response = await fetch('http://localhost:8080/produto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItemDetails)
      });
      if (response.ok) {
        const data = await response.json();
        setEstoque(prevState => ({
          ...prevState,
          [data.nomeProduto]: data.quantidadeEstoque
        }));
        setNewItemDetails({
          nomeProduto: '',
          descricao: '',
          preco: '',
          quantidadeEstoque: '',
          categoria: '',
          imagemProduto: null
        });
        alert('Item adicionado com sucesso!');
        await fetchItensFromAPI(); // Atualizar os itens após adicionar novo item
      } else {
        alert('Erro ao adicionar item');
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert('Erro ao adicionar item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/produto/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Item excluído com sucesso!');
        await fetchItensFromAPI(); // Atualizar os itens após excluir um item
      } else {
        alert('Erro ao excluir item');
      }
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      alert('Erro ao excluir item');
    }
  };

  const fetchItensFromAPI = async () => {
    try {
      const response = await fetch('http://localhost:8080/produto');
      const data = await response.json();
      console.log('API Response:', data);

      if (Array.isArray(data)) {
        const newEstoque = data.reduce((acc: any, item: Item) => {
          if (item.nomeProduto) {
            acc[item.nomeProduto] = item.quantidadeEstoque || 0;
          }
          return acc;
        }, {});

        setEstoque(prevState => ({
          ...prevState,
          ...newEstoque
        }));

        setItems(data); // Atualizar o estado dos itens com os dados recebidos
      } else {
        console.error('Error: API response is not an array', data);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  useEffect(() => {
    fetchItensFromAPI(); // Carregar itens na inicialização
  }, []);

  return (
    <div>
      <header className="cabecalho">
        <div className="container-esse">
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
        {/* <h2 className="estoque-sub">Geladeira</h2> */}
        <div className="item-list">
          {items.map((item) => (
            <div className="item" key={item.id}>
              <span>{item.nomeProduto}</span>
              <div className="controls">
                <button onClick={() => decrement(item.nomeProduto as keyof EstoqueState)}>-</button>
                <input
                  type="number"
                  value={estoque[item.nomeProduto as keyof EstoqueState]}
                  onChange={(e) => handleInputChange(item.nomeProduto as keyof EstoqueState, e)}
                />
                <button onClick={() => increment(item.nomeProduto as keyof EstoqueState)}>+</button>
                <button onClick={() => handleDeleteItem(item.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
        <div className="new-item-details-form">
  <div className="input-wrapper">
    <label htmlFor="nomeProduto">Nome:</label>
    <input
      type="text"
      id="nomeProduto"
      name="nomeProduto"
      value={newItemDetails.nomeProduto}
      onChange={handleDetailChange}
    />
  </div>
  <div className="input-wrapper">
    <label htmlFor="descricao">Descrição:</label>
    <input
      type="text"
      id="descricao"
      name="descricao"
      value={newItemDetails.descricao}
      onChange={handleDetailChange}
    />
  </div>
  <div className="input-wrapper">
    <label htmlFor="preco">Preço:</label>
    <input
      type="number"
      id="preco"
      name="preco"
      value={newItemDetails.preco}
      onChange={handleDetailChange}
    />
  </div>
  <div className="input-wrapper">
    <label htmlFor="quantidadeEstoque">Quantidade:</label>
    <input
      type="number"
      id="quantidadeEstoque"
      name="quantidadeEstoque"
      value={newItemDetails.quantidadeEstoque}
      onChange={handleDetailChange}
    />
  </div>
  <div className="input-wrapper">
    <label htmlFor="categoria">Categoria:</label>
    <input
      type="text"
      id="categoria"
      name="categoria"
      value={newItemDetails.categoria}
      onChange={handleDetailChange}
    />
  </div>
  <button onClick={handleAddItemToAPI}>Adicionar</button>
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
