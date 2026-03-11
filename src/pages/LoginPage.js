import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, getUsers } from '../services/api';

function LoginPage() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!phone || !name) {
      setError('Por favor ingresa tu número y nombre');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Buscar si el usuario ya existe
      const response = await getUsers();
      const existingUser = response.data.find(u => u.phone === phone);

      if (existingUser) {
        localStorage.setItem('userId', existingUser.id);
        localStorage.setItem('userName', existingUser.name);
        navigate('/groups');
      } else {
        // Crear usuario nuevo
        const newUser = await createUser(phone, name);
        localStorage.setItem('userId', newUser.data.id);
        localStorage.setItem('userName', newUser.data.name);
        navigate('/groups');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🛡️</div>
        <h1 style={styles.title}>Leonidas</h1>
        <p style={styles.subtitle}>Red comunitaria de seguridad</p>

        <input
          style={styles.input}
          type="tel"
          placeholder="Número de teléfono (+573001234567)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#0a0e1a'
  },
  card: {
    background: '#111827',
    padding: '40px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid #1e2d45'
  },
  logo: { fontSize: '48px' },
  title: {
    fontFamily: 'sans-serif',
    color: '#e8eaf0',
    fontSize: '28px',
    margin: 0
  },
  subtitle: {
    color: '#8b97b0',
    fontSize: '14px',
    margin: 0
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: '#1a2235',
    border: '1px solid #1e2d45',
    borderRadius: '10px',
    color: '#e8eaf0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: '#e63946',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  error: {
    color: '#e63946',
    fontSize: '13px',
    margin: 0
  }
};

export default LoginPage;