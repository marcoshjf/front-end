import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/cadFunc.css';

const CadastroFuncionario: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [senha, setSenha] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Adiciona o novo funcionário ao localStorage
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    funcionarios.push({ nome, email, senha, cargo, isAdmin });
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));

    console.log({ nome, email, cargo, isAdmin });

    // Redireciona para a tela de login
    navigate('/');
  };

  const handleBackClick = () => {
    navigate('/adm_user');
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Funcionário</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cargo">Cargo:</label>
          <input
            type="text"
            id="cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="isAdmin">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            Administrador
          </label>
        </div>
        <div className="button-group">
          <button className='button-func' type="submit">Cadastrar</button>
          <button type="button" onClick={handleBackClick} className="back-button">
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroFuncionario;
