import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === '1' && password === '1') {
      navigate('/adm_user');
    } 
    else if (username === '2' && password === '2') {
      navigate('/cadastro_vendas')
    }
    else {
      alert('Usuário ou senha inválidos');
    }
  };

  return (
    <div>
      <div className="login">
        <h1 className="logo">
          <span className="pro">pro</span>BARBER
        </h1>
        <div className="ajuste">
          <div className="cont_user">
            <h2 className="usuario">Usuário</h2>
            <input
              className="inserir-usuario"
              type="text"
              placeholder="  Insira seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="cont_senha">
            <h2 className="senha">Senha</h2>
            <input
              className="inserir-senha"
              type="password"
              placeholder="  Insira sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="botao">
          <button className="botao-entrar" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
