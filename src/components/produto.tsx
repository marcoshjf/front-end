import React, { useState } from 'react';
import "../styles/outlet_serv.css";

const Produto: React.FC = () => {
  const [selectedprodutos, setSelectedprodutos] = useState<string[]>([]);
  
  const produtos = ["Cerveja 1", "Cerveja 2", "Agua s/ Gás", "Agua c/ Gás"];

  const handleCheckboxChange = (produtos: string) => {
    setSelectedprodutos(prevState =>
      prevState.includes(produtos)
        ? prevState.filter(item => item !== produtos)
        : [...prevState, produtos]
    );
  };

  return (
    <div className="corpo_prod">
      <h3>Produtos:</h3>
      <div className="lista_produtos">
        {produtos.map((produtos, index) => (
          <label key={index} className="lista_prod">
            <input
              type="checkbox"
              checked={selectedprodutos.includes(produtos)}
              onChange={() => handleCheckboxChange(produtos)}
            />
            {produtos}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Produto;
