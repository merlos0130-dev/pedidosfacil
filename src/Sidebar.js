import React from 'react';

const items = [
  { id:'dashboard', icon:'🏠', label:'Inicio' },
  { id:'pedidos',   icon:'📦', label:'Pedidos' },
  { id:'productos', icon:'🛍', label:'Productos' },
  { id:'clientes',  icon:'👥', label:'Clientes' },
  { id:'cupones',   icon:'🎟️', label:'Cupones' },
  { id:'reportes',  icon:'📊', label:'Reportes' },
];

export default function Sidebar({ pagina, setPagina, pedidosNuevos, negocio, onCerrarSesion }) {
  return (
    <aside style={{ width:220, background:'#1E293B', color:'#fff', display:'flex', flexDirection:'column', minHeight:'100vh', flexShrink:0 }}>
      <div style={{ padding:'1.25rem 1rem', borderBottom:'1px solid #334155' }}>
        <div style={{ fontSize:18, fontWeight:700 }}>🛍 PedidosFácil</div>
        <div style={{ fontSize:12, color:'#94A3B8', marginTop:4 }}>{negocio?.nombre || 'Mi negocio'}</div>
        <div style={{ fontSize:11, color:'#475569', marginTop:2 }}>{negocio?.tipo || ''}</div>
      </div>
      <nav style={{ flex:1, padding:'0.75rem 0' }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setPagina(item.id)}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 1rem',
              background: pagina===item.id ? '#2563EB' : 'transparent',
              color: pagina===item.id ? '#fff' : '#94A3B8',
              border:'none', cursor:'pointer', fontSize:14, textAlign:'left', position:'relative' }}>
            <span style={{ fontSize:18 }}>{item.icon}</span>
            {item.label}
            {item.id==='pedidos' && pedidosNuevos > 0 && (
              <span style={{ marginLeft:'auto', background:'#EF4444', color:'#fff', borderRadius:99, fontSize:11, padding:'1px 7px', fontWeight:700 }}>
                {pedidosNuevos}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div style={{ padding:'1rem', borderTop:'1px solid #334155', display:'flex', flexDirection:'column', gap:4 }}>
        <button onClick={() => setPagina('config')}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 0',
            background:'transparent', color:'#94A3B8', border:'none', cursor:'pointer', fontSize:14 }}>
          ⚙️ Configuración
        </button>
        <button onClick={onCerrarSesion}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 0',
            background:'transparent', color:'#EF4444', border:'none', cursor:'pointer', fontSize:13 }}>
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
