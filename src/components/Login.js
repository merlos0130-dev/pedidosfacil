import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function Login({ onLogin }) {
  const [modo, setModo] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [negocio, setNegocio] = useState('');
  const [tipo, setTipo] = useState('Comida');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const tipos = ['Comida','Farmacia','Tienda','Otro'];

  const handleLogin = async () => {
    setCargando(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email o contraseña incorrectos');
    setCargando(false);
  };

  const handleRegistro = async () => {
    if (!negocio) { setError('Escribe el nombre de tu negocio'); return; }
    setCargando(true); setError('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setCargando(false); return; }
    if (data.user) {
      await supabase.from('negocios').insert({ user_id: data.user.id, nombre: negocio, tipo });
    }
    setCargando(false);
    setError('¡Cuenta creada! Revisa tu email para confirmar.');
  };

  return (
    <div style={{ minHeight:'100vh', background:'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ background:'#fff', borderRadius:16, padding:'2rem', width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🛍</div>
          <div style={{ fontSize:22, fontWeight:700 }}>PedidosFácil</div>
          <div style={{ fontSize:14, color:'#64748B', marginTop:4 }}>Panel para negocios</div>
        </div>

        <div style={{ display:'flex', marginBottom:'1.5rem', background:'#F1F5F9', borderRadius:8, padding:4 }}>
          {['login','registro'].map(m => (
            <button key={m} onClick={()=>{ setModo(m); setError(''); }}
              style={{ flex:1, padding:'8px', borderRadius:6, border:'none', cursor:'pointer', fontSize:13, fontWeight:500,
                background: modo===m ? '#fff' : 'transparent',
                color: modo===m ? '#1E293B' : '#64748B' }}>
              {m==='login' ? 'Entrar' : 'Registrarse'}
            </button>
          ))}
        </div>

        {modo==='registro' && (
          <>
            <div style={{ marginBottom:'0.75rem' }}>
              <label style={{ fontSize:13, color:'#64748B', display:'block', marginBottom:4 }}>Nombre de tu negocio</label>
              <input value={negocio} onChange={e=>setNegocio(e.target.value)}
                placeholder="Ej: Restaurante El Buen Sabor"
                style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, outline:'none' }} />
            </div>
            <div style={{ marginBottom:'0.75rem' }}>
              <label style={{ fontSize:13, color:'#64748B', display:'block', marginBottom:4 }}>Tipo de negocio</label>
              <select value={tipo} onChange={e=>setTipo(e.target.value)}
                style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, outline:'none' }}>
                {tipos.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </>
        )}

        <div style={{ marginBottom:'0.75rem' }}>
          <label style={{ fontSize:13, color:'#64748B', display:'block', marginBottom:4 }}>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="tu@negocio.com"
            style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, outline:'none' }} />
        </div>

        <div style={{ marginBottom:'1rem' }}>
          <label style={{ fontSize:13, color:'#64748B', display:'block', marginBottom:4 }}>Contraseña</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, outline:'none' }} />
        </div>

        {error && (
          <div style={{ padding:'10px 12px', borderRadius:8, background: error.includes('creada') ? '#F0FDF4' : '#FEF2F2',
            color: error.includes('creada') ? '#16A34A' : '#DC2626', fontSize:13, marginBottom:'1rem' }}>
            {error}
          </div>
        )}

        <button onClick={modo==='login' ? handleLogin : handleRegistro} disabled={cargando}
          style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', background:'#2563EB', color:'#fff',
            fontWeight:600, fontSize:15, cursor: cargando ? 'not-allowed' : 'pointer', opacity: cargando ? 0.7 : 1 }}>
          {cargando ? 'Cargando...' : modo==='login' ? 'Entrar al panel' : 'Crear cuenta gratis'}
        </button>

        <div style={{ textAlign:'center', marginTop:'1rem', fontSize:13, color:'#94A3B8' }}>
          100% gratis · Sin tarjeta de crédito
        </div>
      </div>
    </div>
  );
}
