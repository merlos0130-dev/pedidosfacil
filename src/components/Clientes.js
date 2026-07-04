import React, { useState } from 'react';

export default function Clientes({ clientes }) {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.telefono && c.telefono.includes(busqueda))
  );

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    const d = new Date(fecha);
    const hoy = new Date();
    const diff = Math.floor((hoy - d) / (1000*60*60*24));
    if (diff === 0) return 'hoy';
    if (diff === 1) return 'ayer';
    return `hace ${diff} días`;
  };

  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
        <h1 style={{ fontSize:20, fontWeight:700 }}>Clientes</h1>
        {clientes.length > 0 && (
          <input value={busqueda} onChange={e=>setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, width:260, outline:'none' }} />
        )}
      </div>

      {clientes.length === 0 ? (
        <div style={{ background:'#fff', borderRadius:12, padding:'3rem', textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>👥</div>
          <div style={{ fontWeight:600, marginBottom:6 }}>No hay clientes aún</div>
          <div style={{ fontSize:14, color:'#94A3B8' }}>Aquí aparecerán los clientes que hagan pedidos a tu negocio</div>
        </div>
      ) : (
        <div style={{ background:'#fff', borderRadius:12, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['Cliente','Teléfono','Dirección','Pedidos','Último pedido','Total gastado'].map(h=>(
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:12, color:'#64748B', fontWeight:600, borderBottom:'1px solid #F1F5F9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c,i)=>(
                <tr key={i} style={{ borderBottom:'1px solid #F8FAFC' }}>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#2563EB', flexShrink:0 }}>
                        {c.nombre?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <span style={{ fontSize:14, fontWeight:500 }}>{c.nombre}</span>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'#64748B' }}>{c.telefono || '-'}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'#64748B' }}>{c.direccion || '-'}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, fontWeight:600, textAlign:'center' }}>{c.pedidos}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'#64748B' }}>{formatFecha(c.ultimo)}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, fontWeight:600, color:'#10B981' }}>Bs. {c.gasto.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtrados.length === 0 && (
            <div style={{ padding:'2rem', textAlign:'center', color:'#94A3B8', fontSize:14 }}>No se encontraron clientes.</div>
          )}
        </div>
      )}
    </div>
  );
}
