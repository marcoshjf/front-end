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

interface Item {
  idPedido: string;
  nome: string;
  preco: number;
  categoria: string;
}

const CadVendas: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState<{ [key: number]: boolean }>({});
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    Servicos: {},
    Produtos: {},
    Geladeira: {},
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

  // Função para fazer o POST do cabeçalho e retornar o idPedido
  const postCabecalho = async () => {
    const cabecalhoData = {
      valorTotal,
      valorServicos,
      valorProdutos,
      valorGeladeira,
    };

    try {
      const response = await fetch('http://localhost:8080/cabecalho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cabecalhoData),
      });

      if (!response.ok) {
        throw new Error('Failed to post cabecalho');
      }

      const responseData = await response.json();
      return responseData.idPedido; // Supondo que a resposta contém o idPedido
    } catch (error) {
      console.error('Error posting cabecalho:', error);
      return null;
    }
  };

  // Função para fazer o POST dos itens do pedido
  const postItens = async (idPedido: string) => {
    const itens: Item[] = [];

    Object.keys(selectedItems.Servicos).forEach((item) => {
      if (selectedItems.Servicos[item]) {
        itens.push({
          idPedido,
          nome: item,
          preco: precos[item],
          categoria: 'Servico',
        });
      }
    });

    Object.keys(selectedItems.Produtos).forEach((item) => {
      if (selectedItems.Produtos[item]) {
        itens.push({
          idPedido,
          nome: item,
          preco: precos[item],
          categoria: 'Produto',
        });
      }
    });

    Object.keys(selectedItems.Geladeira).forEach((item) => {
      if (selectedItems.Geladeira[item]) {
        itens.push({
          idPedido,
          nome: item,
          preco: precos[item],
          categoria: 'Geladeira',
        });
      }
    });

    try {
      const response = await fetch(`http://localhost:8080/api/pedidos/${idPedido}/itens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itens),
      });

      if (!response.ok) {
        throw new Error('Failed to post itens');
      }

      console.log('Itens posted successfully');
    } catch (error) {
      console.error('Error posting itens:', error);
    }
  };

  // Função para confirmar o pedido, fazendo o POST do cabeçalho e dos itens
  const handleConfirm = async () => {
    const idPedido = await postCabecalho();

    if (idPedido) {
      await postItens(idPedido);
      // Recupera a lista de barbeiros do localStorage
      const barbeiros = JSON.parse(localStorage.getItem('barbeiros') || '[]');
      // Adiciona o novo pedido à lista
      barbeiros.push({ idPedido, valorTotal, valorServicos, valorProdutos, valorGeladeira });
      // Atualiza a lista no localStorage
      localStorage.setItem('barbeiros', JSON.stringify(barbeiros));
      // Navega para a página de administração de usuários com o estado atualizado
      navigate("/adm_user", {
        state: { barbeiros },
      });
    } else {
      console.error('Failed to create cabecalho');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const toggleMenu = async (menuId: number) => {
    setMenuOpen(prevState => ({
      ...prevState,
      [menuId]: !prevState[menuId]
    }));

    if (!isMenuOpen[menuId]) {
      try {
        const response = await fetch('http://localhost:8080/produto');
        const data = await response.json();
        console.log('API Response:', data);

        if (Array.isArray(data)) {
          const newServicos = data.reduce((acc: any, item: any) => {
            if (item.categoria === "Servico" && item.nomeProduto) {
              acc[item.nomeProduto] = false;
            }
            return acc;
          }, {});

          const newProdutos = data.reduce((acc: any, item: any) => {
            if (item.categoria === "Produto" && item.nomeProduto) {
              acc[item.nomeProduto] = false;
            }
            return acc;
          }, {});

          const newGeladeira = data.reduce((acc: any, item: any) => {
            if (item.categoria === "Geladeira" && item.nomeProduto) {
              acc[item.nomeProduto] = false;
            }
            return acc;
          }, {});

          setSelectedItems(prevState => ({
            ...prevState,
            Servicos: {
              ...prevState.Servicos,
              ...newServicos
            },
            Produtos: {
              ...prevState.Produtos,
              ...newProdutos
            },
            Geladeira: {
              ...prevState.Geladeira,
              ...newGeladeira
            }
          }));

          const newPrecos = data.reduce((acc: any, item: any) => {
            if (item.nomeProduto) {
              acc[item.nomeProduto] = item.preco;
            }
            return acc;
          }, {});

          setPrecos(prevState => ({
            ...prevState,
            ...newPrecos
          }));
        } else {
          console.error('Error: API response is not an array', data);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    }
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

  useEffect(() => {
    // Carregar itens na inicialização
    const fetchItensFromAPI = async () => {
      try {
        const response = await fetch('http://localhost:8080/produto');
        const data = await response.json();
        console.log('API Response:', data);

        if (Array.isArray(data)) {
          const newServicos = data.reduce((acc: any, item: any) => {
            if (item.categoria === "Servico" && item.nomeProduto) {
              acc[item.nomeProduto] = false;
            }
            return acc;
          }, {});

          const newProdutos = data.reduce((acc: any, item: any) => {
            if (item.categoria === "Produto" && item.nomeProduto) {
              acc[item.nomeProduto] = false;
            }
            return acc;
          }, {});

          const newGeladeira = data.reduce((acc: any, item: any) => {
            if (item.categoria === "Geladeira" && item.nomeProduto) {
              acc[item.nomeProduto] = false;
            }
            return acc;
          }, {});

          setSelectedItems(prevState => ({
            ...prevState,
            Servicos: {
              ...prevState.Servicos,
              ...newServicos
            },
            Produtos: {
              ...prevState.Produtos,
              ...newProdutos
            },
            Geladeira: {
              ...prevState.Geladeira,
              ...newGeladeira
            }
          }));

          const newPrecos = data.reduce((acc: any, item: any) => {
            if (item.nomeProduto) {
              acc[item.nomeProduto] = item.preco;
            }
            return acc;
          }, {});

          setPrecos(prevState => ({
            ...prevState,
            ...newPrecos
          }));
        } else {
          console.error('Error: API response is not an array', data);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchItensFromAPI();
  }, []);

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
