import React, { useState } from 'react';
import ModalPedido from './ModalPedido';

const estadoConfig = {
  nuevo:      { label:'Nuevo',          color:'#F59E0B', bg:'#FEF3C7', siguiente:'preparacion' },
  preparacion:{ label:'En preparación', color:'#3B82F6', bg:'#DBEAFE', siguiente:'listo'       },
  listo:      { label:'Listo',          color:'#10B981', bg:'#D1FAE5', siguiente:'entregado'   },
  entregado:  { label:'Entregado',      color:'#6B7280', bg:'#F3F4F6', siguiente:null          },
};

export default function Pedidos({ pedidos, onCambiarEstado }) {
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);

  const filtrados = pedidos.filter(p => {
    const matchFiltro = filtro==='todos' || p.estado===filtro;
    const matchBusqueda = p.cliente_nombre?.toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusqueda;
  });

  const filtros = [
    { key:'todos',      label:'Todos' },
    { key:'nuevo',      label:'Nuevos' },
    { key:'preparacion',label:'En preparación' },
    { key:'listo',      label:'Listos' },
    { key:'entregado',  label:'Entregados' },
  ];

  const getProductosTexto = (p) => {
    if (!p.productos) return '-';
    if (Array.isArray(p.productos)) return p.productos.map(x=>x.nombre).join(', ');
    try { return JSON.parse(p.productos).map(x=>x.nombre).join(', '); } catch(e) { return '-'; }
  };

  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
        <h1 style={{ fontSize:20, fontWeight:700 }}>Pedidos</h1>
        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)}
          placeholder="Buscar por cliente..."
          style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, width:240, outline:'none' }} />
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:'1rem', flexWrap:'wrap' }}>
        {filtros.map(f => (
          <button key={f.key} onClick={()=>setFiltro(f.key)}
            style={{ padding:'6px 14px', borderRadius:99, border:'1px solid', fontSize:13, cursor:'pointer',
              borderColor: filtro===f.key ? '#2563EB' : '#E2E8F0',
              background: filtro===f.key ? '#EFF6FF' : 'transparent',
              color: filtro===f.key ? '#2563EB' : '#64748B', fontWeight: filtro===f.key ? 600 : 400 }}>
            {f.label}
            <span style={{ marginLeft:6, background: filtro===f.key?'#2563EB':'#E2E8F0', color: filtro===f.key?'#fff':'#64748B', borderRadius:99, fontSize:11, padding:'0 6px' }}>
              {f.key==='todos' ? pedidos.length : pedidos.filter(p=>p.estado===f.key).length}
            </span>
          </button>
        ))}
      </div>

      {pedidos.length === 0 ? (
        <div style={{ background:'#fff', borderRadius:12, padding:'4rem', textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
          <div style={{ fontWeight:600, fontSize:16, marginBottom:8 }}>No hay pedidos aún</div>
          <div style={{ fontSize:14, color:'#94A3B8' }}>Cuando un cliente haga un pedido aparecerá aquí automáticamente.</div>
        </div>
      ) : (
        <div style={{ background:'#fff', borderRadius:12, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['Cliente','Productos','Total','Estado','Hora','Acciones'].map(h=>(
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:12, color:'#64748B', fontWeight:600, borderBottom:'1px solid #F1F5F9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(p => {
                const cfg = estadoConfig[p.estado] || estadoConfig.nuevo;
                return (
                  <tr key={p.id} style={{ borderBottom:'1px solid #F8FAFC' }}>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ fontSize:13, fontWeight:500 }}>{p.cliente_nombre}</div>
                      <div style={{ fontSize:12, color:'#94A3B8' }}>{p.cliente_telefono}</div>
                    </td>
                    <td style={{ padding:'12px 14px', fontSize:12, color:'#64748B', maxWidth:180 }}>{getProductosTexto(p)}</td>
                    <td style={{ padding:'12px 14px', fontSize:13, fontWeight:600 }}>Bs. {Number(p.total||0).toFixed(0)}</td>
                    <td style={{ padding:'12px 14px' }}>
                      <span style={{ background:cfg.bg, color:cfg.color, fontSize:12, padding:'4px 10px', borderRadius:99, fontWeight:500 }}>{cfg.label}</span>
                    </td>
                    <td style={{ padding:'12px 14px', fontSize:12, color:'#94A3B8' }}>
                      {new Date(p.created_at).toLocaleTimeString('es-BO',{hour:'2-digit',minute:'2-digit'})}
                    </td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={()=>setSeleccionado(p)}
                          style={{ padding:'5px 10px', borderRadius:6, border:'1px solid #E2E8F0', background:'transparent', cursor:'pointer', fontSize:12 }}>
                          👁 Ver
                        </button>
                        {cfg.siguiente && (
                          <button onClick={()=>onCambiarEstado(p.id, cfg.siguiente)}
                            style={{ padding:'5px 10px', borderRadius:6, border:'none', background:'#2563EB', color:'#fff', cursor:'pointer', fontSize:12 }}>
                            ▶ Avanzar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtrados.length === 0 && (
            <div style={{ padding:'2rem', textAlign:'center', color:'#94A3B8', fontSize:14 }}>No hay pedidos con ese filtro.</div>
          )}
        </div>
      )}
      <ModalPedido pedido={seleccionado} onClose={()=>setSeleccionado(null)} onCambiarEstado={onCambiarEstado} />
    </div>
  );
}
