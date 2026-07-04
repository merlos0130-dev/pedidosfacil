import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Pedidos from './components/Pedidos';
import Productos from './components/Productos';
import Clientes from './components/Clientes';
import Reportes from './components/Reportes';
import Cupones from './components/Cupones';
import Configuracion from './components/Configuracion';

function tocarCampana() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc.start(); osc.stop(ctx.currentTime + 1);
    const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain();
    osc2.connect(gain2); gain2.connect(ctx.destination);
    osc2.frequency.value = 1100;
    gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc2.start(ctx.currentTime + 0.2); osc2.stop(ctx.currentTime + 1);
  } catch(e) {}
}

export default function App() {
  const [session, setSession] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState('dashboard');
  const [negocio, setNegocio] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [notif, setNotif] = useState(null);
  const [cantAnterior, setCantAnterior] = useState(null);

  const pedidosNuevos = pedidos.filter(p => p.estado === 'nuevo').length;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setCargando(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) { setNegocio(null); setPedidos([]); setProductos([]); setClientes([]); setCantAnterior(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    const cargarNegocio = async () => {
      const { data } = await supabase.from('negocios').select('*').eq('user_id', session.user.id).single();
      if (data) {
        setNegocio(data);
        await cargarPedidos(data.id, true);
        cargarProductos(data.id);
        cargarClientes(data.id);
        const intervalo = setInterval(() => cargarPedidos(data.id, false), 15000);
        return () => clearInterval(intervalo);
      }
    };
    cargarNegocio();
  }, [session]);

  const cargarPedidos = async (negocioId, esPrimera) => {
    const { data } = await supabase.from('pedidos').select('*').eq('negocio_id', negocioId).order('created_at', { ascending: false });
    if (data) {
      if (!esPrimera) {
        setCantAnterior(prev => {
          if (prev !== null && data.length > prev) {
            tocarCampana();
            setNotif(`🔔 Nuevo pedido de ${data[0].cliente_nombre}`);
            setTimeout(() => setNotif(null), 5000);
          }
          return data.length;
        });
      } else { setCantAnterior(data.length); }
      setPedidos(data);
    }
  };

  const cargarProductos = async (negocioId) => {
    const { data } = await supabase.from('productos').select('*').eq('negocio_id', negocioId).order('created_at', { ascending: true });
    if (data) setProductos(data);
  };

  const cargarClientes = async (negocioId) => {
    const { data } = await supabase.from('pedidos').select('cliente_nombre, cliente_telefono, cliente_direccion, total, created_at').eq('negocio_id', negocioId);
    if (data) {
      const mapa = {};
      data.forEach(p => {
        const key = p.cliente_telefono || p.cliente_nombre;
        if (!mapa[key]) mapa[key] = { nombre: p.cliente_nombre, telefono: p.cliente_telefono, direccion: p.cliente_direccion, pedidos: 0, gasto: 0, ultimo: p.created_at };
        mapa[key].pedidos += 1; mapa[key].gasto += Number(p.total) || 0;
        if (p.created_at > mapa[key].ultimo) mapa[key].ultimo = p.created_at;
      });
      setClientes(Object.values(mapa));
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
    await supabase.from('pedidos').update({ estado: nuevoEstado }).eq('id', id);
  };

  const agregarProducto = async (prod) => {
    const { data } = await supabase.from('productos').insert({ ...prod, negocio_id: negocio.id }).select().single();
    if (data) setProductos(prev => [...prev, data]);
  };

  const toggleProducto = async (id, activo) => {
    setProductos(prev => prev.map(p => p.id === id ? { ...p, activo } : p));
    await supabase.from('productos').update({ activo }).eq('id', id);
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    setProductos(prev => prev.filter(p => p.id !== id));
    await supabase.from('productos').delete().eq('id', id);
  };

  const cerrarSesion = () => supabase.auth.signOut();

  if (cargando) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F1F5F9' }}>
      <div style={{ textAlign:'center' }}><div style={{ fontSize:32, marginBottom:8 }}>🛍</div><div style={{ fontSize:14, color:'#64748B' }}>Cargando...</div></div>
    </div>
  );

  if (!session) return <Login />;

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Sidebar pagina={pagina} setPagina={setPagina} pedidosNuevos={pedidosNuevos} negocio={negocio} onCerrarSesion={cerrarSesion} />
      <main style={{ flex:1, overflowY:'auto', background:'#F1F5F9' }}>
        {pagina==='dashboard' && <Dashboard pedidos={pedidos} productos={productos} setPagina={setPagina} negocio={negocio} />}
        {pagina==='pedidos'   && <Pedidos pedidos={pedidos} onCambiarEstado={cambiarEstado} />}
        {pagina==='productos' && <Productos productos={productos} onAgregarProducto={agregarProducto} onToggleProducto={toggleProducto} onEliminarProducto={eliminarProducto} />}
        {pagina==='clientes'  && <Clientes clientes={clientes} />}
        {pagina==='cupones'   && <Cupones negocio={negocio} />}
        {pagina==='reportes'  && <Reportes pedidos={pedidos} productos={productos} />}
        {pagina==='config'    && <Configuracion negocio={negocio} setNegocio={setNegocio} session={session} onCerrarSesion={cerrarSesion} />}
      </main>
      {notif && (
        <div onClick={()=>setNotif(null)} style={{ position:'fixed', top:20, right:20, background:'#1E293B', color:'#fff', padding:'14px 20px', borderRadius:12, fontSize:14, fontWeight:500, zIndex:9999, boxShadow:'0 4px 20px rgba(0,0,0,0.3)', cursor:'pointer' }}>
          {notif}
        </div>
      )}
    </div>
  );
}
