import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Cupones({ negocio }) {
  const [cupones, setCupones] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevo, setNuevo] = useState({ codigo:'', descuento:'', tipo:'porcentaje', usos_maximos:100 });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!negocio) return;
    cargarCupones();
  }, [negocio]);

  const cargarCupones = async () => {
    const { data } = await supabase.from('cupones').select('*').eq('negocio_id', negocio.id).order('created_at', { ascending: false });
    if (data) setCupones(data);
  };

  const agregar = async () => {
    if (!nuevo.codigo || !nuevo.descuento) return;
    setGuardando(true);
    const { data } = await supabase.from('cupones').insert({
      negocio_id: negocio.id,
      codigo: nuevo.codigo.toUpperCase().trim(),
      descuento: Number(nuevo.descuento),
      tipo: nuevo.tipo,
      usos_maximos: Number(nuevo.usos_maximos),
      activo: true
    }).select().single();
    if (data) setCupones(prev => [data, ...prev]);
    setNuevo({ codigo:'', descuento:'', tipo:'porcentaje', usos_maximos:100 });
    setMostrarForm(false);
    setGuardando(false);
  };

  const toggleCupon = async (id, activo) => {
    setCupones(prev => prev.map(c => c.id===id ? {...c, activo} : c));
    await supabase.from('cupones').update({ activo }).eq('id', id);
  };

  const eliminarCupon = async (id) => {
    setCupones(prev => prev.filter(c => c.id !== id));
    await supabase.from('cupones').delete().eq('id', id);
  };

  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
        <h1 style={{ fontSize:20, fontWeight:700 }}>Cupones y descuentos</h1>
        <button onClick={()=>setMostrarForm(true)}
          style={{ padding:'8px 16px', borderRadius:8, border:'none', background:'#2563EB', color:'#fff', fontWeight:600, cursor:'pointer', fontSize:14 }}>
          + Crear cupón
        </button>
      </div>

      {mostrarForm && (
        <div style={{ background:'#fff', borderRadius:12, padding:'1.25rem', marginBottom:'1.25rem', border:'2px solid #2563EB' }}>
          <div style={{ fontWeight:600, marginBottom:'1rem' }}>Nuevo cupón de descuento</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:'1rem' }}>
            <div>
              <label style={{ fontSize:12, color:'#64748B', display:'block', marginBottom:4 }}>Código del cupón</label>
              <input placeholder="Ej: DESCUENTO20" value={nuevo.codigo}
                onChange={e=>setNuevo({...nuevo,codigo:e.target.value.toUpperCase()})}
                style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, outline:'none', fontWeight:700, letterSpacing:1 }} />
            </div>
            <div>
              <label style={{ fontSize:12, color:'#64748B', display:'block', marginBottom:4 }}>Tipo de descuento</label>
              <select value={nuevo.tipo} onChange={e=>setNuevo({...nuevo,tipo:e.target.value})}
                style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, outline:'none' }}>
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="fijo">Monto fijo (Bs.)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:'#64748B', display:'block', marginBottom:4 }}>
                {nuevo.tipo==='porcentaje' ? 'Descuento (%)' : 'Descuento (Bs.)'}
              </label>
              <input type="number" placeholder={nuevo.tipo==='porcentaje'?'Ej: 20':'Ej: 15'}
                value={nuevo.descuento} onChange={e=>setNuevo({...nuevo,descuento:e.target.value})}
                style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, outline:'none' }} />
            </div>
            <div>
              <label style={{ fontSize:12, color:'#64748B', display:'block', marginBottom:4 }}>Usos máximos</label>
              <input type="number" value={nuevo.usos_maximos}
                onChange={e=>setNuevo({...nuevo,usos_maximos:e.target.value})}
                style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, outline:'none' }} />
            </div>
          </div>
          <div style={{ background:'#F0FDF4', borderRadius:8, padding:'10px 12px', marginBottom:'1rem', fontSize:13, color:'#15803D' }}>
            💡 Vista previa: El cliente usará el código <strong>{nuevo.codigo||'CÓDIGO'}</strong> y obtendrá{' '}
            {nuevo.tipo==='porcentaje' ? `${nuevo.descuento||0}% de descuento` : `Bs. ${nuevo.descuento||0} de descuento`}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={agregar} disabled={guardando}
              style={{ padding:'8px 20px', borderRadius:8, border:'none', background:'#2563EB', color:'#fff', fontWeight:600, cursor:'pointer', fontSize:14 }}>
              {guardando ? 'Guardando...' : 'Crear cupón'}
            </button>
            <button onClick={()=>setMostrarForm(false)}
              style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #E2E8F0', background:'transparent', cursor:'pointer', fontSize:14 }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {cupones.length === 0 ? (
        <div style={{ background:'#fff', borderRadius:12, padding:'3rem', textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🎟️</div>
          <div style={{ fontWeight:600, marginBottom:6 }}>No tienes cupones aún</div>
          <div style={{ fontSize:14, color:'#94A3B8' }}>Crea cupones de descuento para atraer más clientes</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {cupones.map(c => (
            <div key={c.id} style={{ background:'#fff', borderRadius:12, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:12, opacity: c.activo?1:0.6 }}>
              <div style={{ background: c.activo?'#EFF6FF':'#F1F5F9', borderRadius:10, padding:'10px 14px', textAlign:'center', flexShrink:0 }}>
                <div style={{ fontWeight:800, fontSize:16, color: c.activo?'#2563EB':'#94A3B8', letterSpacing:1 }}>{c.codigo}</div>
                <div style={{ fontSize:11, color:'#64748B', marginTop:2 }}>código</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:15, color:'#1E293B' }}>
                  {c.tipo==='porcentaje' ? `${c.descuento}% de descuento` : `Bs. ${c.descuento} de descuento`}
                </div>
                <div style={{ fontSize:12, color:'#94A3B8', marginTop:2 }}>
                  Usado {c.usos_actuales} de {c.usos_maximos} veces
                </div>
                <div style={{ marginTop:4, background:'#E2E8F0', borderRadius:99, height:4, overflow:'hidden' }}>
                  <div style={{ background:'#2563EB', width:`${Math.min((c.usos_actuales/c.usos_maximos)*100,100)}%`, height:'100%', borderRadius:99 }} />
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                <button onClick={()=>toggleCupon(c.id, !c.activo)}
                  style={{ padding:'6px 12px', borderRadius:6, border:'1px solid #E2E8F0',
                    background: c.activo?'#F0FDF4':'#FEF2F2', color: c.activo?'#16A34A':'#DC2626',
                    cursor:'pointer', fontSize:12, fontWeight:500 }}>
                  {c.activo ? '✅ Activo' : '❌ Inactivo'}
                </button>
                <button onClick={()=>eliminarCupon(c.id)}
                  style={{ padding:'6px 10px', borderRadius:6, border:'1px solid #FCA5A5', background:'#FEF2F2', color:'#DC2626', cursor:'pointer', fontSize:12 }}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
