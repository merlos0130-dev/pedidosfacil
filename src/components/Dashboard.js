import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const estadoConfig = {
  nuevo:      { label:'Nuevo',          color:'#F59E0B', bg:'#FEF3C7' },
  preparacion:{ label:'En preparación', color:'#3B82F6', bg:'#DBEAFE' },
  listo:      { label:'Listo',          color:'#10B981', bg:'#D1FAE5' },
  entregado:  { label:'Entregado',      color:'#6B7280', bg:'#F3F4F6' },
};

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{ background:'#fff', borderRadius:12, padding:'1rem 1.25rem', flex:1, minWidth:140 }}>
      <div style={{ fontSize:13, color:'#64748B', marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:700, color: color||'#1E293B' }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:'#94A3B8', marginTop:4 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard({ pedidos, productos, setPagina, negocio }) {
  const hoy = new Date().toDateString();
  const pedidosHoy = pedidos.filter(p => new Date(p.created_at).toDateString() === hoy);
  const ingresosHoy = pedidosHoy.filter(p=>p.estado==='entregado').reduce((s,p)=>s+Number(p.total||0),0);
  const enPrep = pedidos.filter(p=>p.estado==='preparacion').length;
  const nuevos = pedidos.filter(p=>p.estado==='nuevo').length;

  // Últimos 7 días
  const ultimos7 = Array.from({length:7}, (_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-i);
    const label = i===0?'Hoy':d.toLocaleDateString('es-BO',{weekday:'short'});
    const count = pedidos.filter(p=>new Date(p.created_at).toDateString()===d.toDateString()).length;
    return { dia: label, pedidos: count };
  }).reverse();

  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ marginBottom:'1.25rem' }}>
        <h1 style={{ fontSize:20, fontWeight:700 }}>Bienvenido{negocio ? `, ${negocio.nombre}` : ''} 👋</h1>
        <div style={{ fontSize:14, color:'#64748B', marginTop:2 }}>Aquí está el resumen de tu negocio hoy</div>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <StatCard label="Pedidos hoy" value={pedidosHoy.length} sub="recibidos hoy" />
        <StatCard label="Pedidos nuevos" value={nuevos} color={nuevos>0?'#F59E0B':undefined} sub="esperando atención" />
        <StatCard label="En preparación" value={enPrep} color={enPrep>0?'#3B82F6':undefined} sub="en proceso" />
        <StatCard label="Ingresos hoy" value={`Bs. ${ingresosHoy.toFixed(0)}`} color="#10B981" sub="pedidos entregados" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:12 }}>
        <div style={{ background:'#fff', borderRadius:12, padding:'1.25rem' }}>
          <div style={{ fontWeight:600, marginBottom:'1rem' }}>Pedidos últimos 7 días</div>
          {pedidos.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'#94A3B8' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📊</div>
              <div>Aún no hay pedidos. Cuando lleguen aparecerán aquí.</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ultimos7}>
                <XAxis dataKey="dia" tick={{ fontSize:12 }} />
                <YAxis tick={{ fontSize:12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="pedidos" fill="#2563EB" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background:'#fff', borderRadius:12, padding:'1.25rem' }}>
          <div style={{ fontWeight:600, marginBottom:'1rem' }}>Últimos pedidos</div>
          {pedidos.length === 0 ? (
            <div style={{ textAlign:'center', padding:'1.5rem', color:'#94A3B8', fontSize:14 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>📦</div>
              No hay pedidos aún
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {pedidos.slice(0,5).map(p => {
                const cfg = estadoConfig[p.estado] || estadoConfig.nuevo;
                return (
                  <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #F1F5F9' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:500 }}>{p.cliente_nombre}</div>
                      <div style={{ fontSize:12, color:'#94A3B8' }}>{new Date(p.created_at).toLocaleTimeString('es-BO',{hour:'2-digit',minute:'2-digit'})}</div>
                    </div>
                    <span style={{ background:cfg.bg, color:cfg.color, fontSize:11, padding:'3px 8px', borderRadius:99, fontWeight:500 }}>{cfg.label}</span>
                    <div style={{ fontSize:13, fontWeight:600 }}>Bs. {Number(p.total||0).toFixed(0)}</div>
                  </div>
                );
              })}
            </div>
          )}
          {pedidos.length > 0 && (
            <button onClick={()=>setPagina('pedidos')}
              style={{ marginTop:'1rem', width:'100%', padding:'8px', borderRadius:8, border:'1px solid #E2E8F0', background:'transparent', cursor:'pointer', fontSize:13, color:'#2563EB' }}>
              Ver todos los pedidos →
            </button>
          )}
        </div>
      </div>

      {productos.length === 0 && (
        <div style={{ marginTop:12, background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:12, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:24 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:600, fontSize:14 }}>No tienes productos cargados</div>
            <div style={{ fontSize:13, color:'#92400E' }}>Agrega tus productos para que los clientes puedan hacer pedidos.</div>
          </div>
          <button onClick={()=>setPagina('productos')}
            style={{ marginLeft:'auto', padding:'8px 14px', borderRadius:8, border:'none', background:'#F59E0B', color:'#fff', fontWeight:600, cursor:'pointer', fontSize:13, flexShrink:0 }}>
            Agregar productos
          </button>
        </div>
      )}
    </div>
  );
}
