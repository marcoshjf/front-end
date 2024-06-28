import React, { useState } from 'react';
import "../styles/outlet_serv.css";

const Geladeira: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const gelado = ["marcos"];

  const handleCheckboxChange = (service: string) => {
    setSelectedServices(prevState =>
      prevState.includes(service)
        ? prevState.filter(item => item !== service)
        : [...prevState, service]
    );
  };

  return (
    <div className="corpo_servico">
      <h3>Serviços:</h3>
      <div className="lista_servicos">
        {gelado.map((service, index) => (
          <label key={index} className="lista_serv">
            <input
              type="checkbox"
              checked={selectedServices.includes(service)}
              onChange={() => handleCheckboxChange(service)}
            />
            {service}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Geladeira;
