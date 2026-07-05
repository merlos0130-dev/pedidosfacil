import React, { useState } from 'react';
import { supabase } from '../supabase';

const CODIGO_ACCESO = '0130';

export default function Login() {
  const [modo, setModo] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [negocio, setNegocio] = useState('');
  const [tipo, setTipo] = useState('Comida');
  const [codigoAcceso, setCodigoAcceso] = useState('');
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
    if (codigoAcceso !== CODIGO_ACCESO) { setError('Código de acceso incorrecto. Contacta al administrador.'); return; }
    setCargando(true); setError('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setCargando(false); return; }
    if (data.user) {
      await supabase.from('negocios').insert({ user_id: data.user.id, nombre: negocio, tipo });
    }
    setCargando(false);
    setError('¡Cuenta creada! Ya puedes entrar con tu email y contraseña.');
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1E293B,#2563EB)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', flexDirection:'column', gap:16 }}>
      <div style={{ background:'#fff', borderRadius:20, padding:'2rem', width:'100%', maxWidth:400, boxShadow:'0 24px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🛍</div>
          <div style={{ fontSize:24, fontWeight:800, color:'#1E293B' }}>PedidosFácil</div>
          <div style={{ fontSize:14, color:'#64748B', marginTop:4 }}>Panel para negocios</div>
        </div>

        <div style={{ display:'flex', marginBottom:'1.5rem', background:'#F1F5F9', borderRadius:10, padding:4 }}>
          {['login','registro'].map(m => (
            <button key={m} onClick={()=>{ setModo(m); setError(''); }}
              style={{ flex:1, padding:'8px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
                background: modo===m ? '#fff' : 'transparent',
                color: modo===m ? '#1E293B' : '#64748B',
                boxShadow: modo===m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
              {m==='login' ? 'Entrar' : 'Registrarse'}
            </button>
          ))}
        </div>

        {modo==='registro' && (
          <>
            <div style={{ marginBottom:'0.75rem' }}>
              <label style={{ fontSize:13, color:'#64748B', display:'block', marginBottom:4, fontWeight:600 }}>Nombre de tu negocio</label>
              <input value={negocio} onChange={e=>setNegocio(e.target.value)}
                placeholder="Ej: Restaurante El Buen Sabor"
                style={{ width:'100%', padding:'12px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none' }} />
            </div>
            <div style={{ marginBottom:'0.75rem' }}>
              <label style={{ fontSize:13, color:'#64748B', display:'block', marginBottom:4, fontWeight:600 }}>Tipo de negocio</label>
              <select value={tipo} onChange={e=>setTipo(e.target.value)}
                style={{ width:'100%', padding:'12px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none' }}>
                {tipos.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:'0.75rem' }}>
              <label style={{ fontSize:13, color:'#64748B', display:'block', marginBottom:4, fontWeight:600 }}>Código de acceso <span style={{ color:'#EF4444' }}>*</span></label>
              <input value={codigoAcceso} onChange={e=>setCodigoAcceso(e.target.value)}
                placeholder="Ingresa el código que te dio el administrador"
                type="password"
                style={{ width:'100%', padding:'12px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none' }} />
              <div style={{ fontSize:11, color:'#94A3B8', marginTop:4 }}>Contacta a AX/CAPITALBOLIVIA para obtener tu código</div>
            </div>
          </>
        )}

        <div style={{ marginBottom:'0.75rem' }}>
          <label style={{ fontSize:13, color:'#64748B', display:'block', marginBottom:4, fontWeight:600 }}>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="tu@negocio.com"
            style={{ width:'100%', padding:'12px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none' }} />
        </div>

        <div style={{ marginBottom:'1rem' }}>
          <label style={{ fontSize:13, color:'#64748B', display:'block', marginBottom:4, fontWeight:600 }}>Contraseña</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            style={{ width:'100%', padding:'12px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none' }} />
        </div>

        {error && (
          <div style={{ padding:'10px 12px', borderRadius:10, background: error.includes('creada')||error.includes('Cuenta') ? '#F0FDF4' : '#FEF2F2',
            color: error.includes('creada')||error.includes('Cuenta') ? '#16A34A' : '#DC2626', fontSize:13, marginBottom:'1rem', fontWeight:500 }}>
            {error}
          </div>
        )}

        <button onClick={modo==='login' ? handleLogin : handleRegistro} disabled={cargando}
          style={{ width:'100%', padding:'14px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#2563EB,#7C3AED)', color:'#fff',
            fontWeight:700, fontSize:15, cursor: cargando ? 'not-allowed' : 'pointer', opacity: cargando ? 0.7 : 1 }}>
          {cargando ? 'Cargando...' : modo==='login' ? 'Entrar al panel' : 'Crear cuenta'}
        </button>

        <div style={{ textAlign:'center', marginTop:'1rem', fontSize:12, color:'#94A3B8' }}>
          100% gratis · Sin tarjeta de crédito
        </div>
      </div>

      {/* Footer creador */}
      <div style={{ textAlign:'center', fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>
        Creado por <strong style={{ color:'rgba(255,255,255,0.8)' }}>ALVARO R. MERLOS VALLEJOS</strong><br/>
        by <strong style={{ color:'rgba(255,255,255,0.8)' }}>AX/CAPITALBOLIVIA</strong>
      </div>
    </div>
  );
}
