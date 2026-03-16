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
    if (!phone || !name) { setError('Completa todos los campos'); return; }
    setLoading(true); setError('');
    try {
      const response = await getUsers();
      const existingUser = response.data.find(u => u.phone === phone);
      if (existingUser) {
        localStorage.setItem('userId', existingUser.id);
        localStorage.setItem('userName', existingUser.name);
        navigate('/groups');
      } else {
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
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}>
            <span style={styles.logoStar}>✦</span>
          </div>
        </div>
        <h1 style={styles.title}>Alpheratz</h1>
        <p style={styles.subtitle}>Conecta con tu mundo</p>

        <div style={styles.inputWrap}>
          <span style={styles.inputIcon}>📱</span>
          <input
            style={styles.input}
            type="tel"
            placeholder="+57 300 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div style={styles.inputWrap}>
          <span style={styles.inputIcon}>👤</span>
          <input
            style={styles.input}
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p style={styles.terms}>Al continuar aceptas nuestros términos de uso</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', background: 'linear-gradient(160deg, #FFF8E7 0%, #FFE8B2 100%)'
  },
  card: {
    background: 'white', padding: '40px 32px', borderRadius: '24px',
    width: '100%', maxWidth: '360px', display: 'flex',
    flexDirection: 'column', alignItems: 'center', gap: '14px',
    boxShadow: '0 8px 40px rgba(244,164,53,0.2)'
  },
  logoWrap: { marginBottom: '4px' },
  logoCircle: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #F4A435, #E8841A)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(244,164,53,0.45)'
  },
  logoStar: { fontSize: '32px', color: 'white' },
  title: {
    fontFamily: 'Georgia, serif', fontSize: '32px',
    fontWeight: '700', color: '#F4A435', letterSpacing: '-0.5px'
  },
  subtitle: { fontSize: '13px', color: '#999', marginTop: '-6px' },
  inputWrap: {
    width: '100%', display: 'flex', alignItems: 'center',
    background: '#FFF8E7', border: '1.5px solid #FFE0A0',
    borderRadius: '12px', padding: '4px 14px', gap: '10px'
  },
  inputIcon: { fontSize: '16px' },
  input: {
    flex: 1, padding: '10px 0', background: 'none',
    border: 'none', outline: 'none', fontSize: '14px', color: '#333'
  },
  button: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #F4A435, #E8841A)',
    border: 'none', borderRadius: '12px', color: 'white',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(244,164,53,0.4)', marginTop: '4px'
  },
  error: { color: '#e63946', fontSize: '13px' },
  terms: { fontSize: '11px', color: '#bbb', textAlign: 'center' }
};

export default LoginPage;