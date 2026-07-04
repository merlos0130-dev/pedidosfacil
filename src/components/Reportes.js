import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORES = ['#2563EB','#10B981','#F59E0B'];

export default function Reportes({ pedidos, productos }) {
  // Seguro contra datos vacíos
  const pedidosSeguros = pedidos || [];
  const productosSeguros = productos || [];

  const porTipo = [
    { name:'Comida',    value: pedidosSeguros.filter(p => p.nota && p.nota.includes('DELIVERY') || true).length > 0 ? pedidosSeguros.filter(p => { try { const prods = Array.isArray(p.productos) ? p.productos : JSON.parse(p.productos||'[]'); return prods.length > 0; } catch(e){ return false; }}).length : 0 },
  ];

  const delivery = pedidosSeguros.filter(p => p.nota && p.nota.includes('DELIVERY')).length;
  const recoger  = pedidosSeguros.filter(p => p.nota && p.nota.includes('RECOGER')).length;
  const otros    = pedidosSeguros.length - delivery - recoger;

  const porEntrega = [
    { name:'Delivery', value: delivery },
    { name:'Recoger',  value: recoger },
    { name:'Otros',    value: otros > 0 ? otros : 0 },
  ].filter(x => x.value > 0);

  // Últimos 7 días
  const ultimos7 = Array.from({length:7}, (_,i) => {
    const d = new Date(); d.setDate(d.getDate()-i);
    const label = i===0 ? 'Hoy' : d.toLocaleDateString('es-BO',{weekday:'short'});
    const count = pedidosSeguros.filter(p => new Date(p.created_at).toDateString() === d.toDateString()).length;
    const ingresos = pedidosSeguros.filter(p => new Date(p.created_at).toDateString() === d.toDateString()).reduce((s,p) => s + Number(p.total||0), 0);
    return { dia: label, pedidos: count, ingresos };
  }).reverse();

  const totalIngresos = pedidosSeguros.reduce((s,p) => s + Number(p.total||0), 0);
  const entregados = pedidosSeguros.filter(p => p.estado === 'entregado').length;
  const ticketPromedio = pedidosSeguros.length > 0 ? (totalIngresos / pedidosSeguros.length).toFixed(0) : 0;

  return (
    <div style={{ padding:'1.5rem' }}>
      <h1 style={{ fontSize:20, fontWeight:700, marginBottom:'1.25rem' }}>Reportes</h1>

      {pedidosSeguros.length === 0 ? (
        <div style={{ background:'#fff', borderRadius:12, padding:'4rem', textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📊</div>
          <div style={{ fontWeight:600, fontSize:16, marginBottom:8 }}>No hay datos aún</div>
          <div style={{ fontSize:14, color:'#94A3B8' }}>Los reportes aparecerán cuando tengas pedidos.</div>
        </div>
      ) : (
        <>
          {/* Resumen */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:'1.25rem' }}>
            {[
              { label:'Total pedidos', value: pedidosSeguros.length, color:'#2563EB' },
              { label:'Total ingresos', value: `Bs. ${totalIngresos.toFixed(0)}`, color:'#10B981' },
              { label:'Ticket promedio', value: `Bs. ${ticketPromedio}`, color:'#F59E0B' },
            ].map(s => (
              <div key={s.label} style={{ background:'#fff', borderRadius:12, padding:'1rem 1.25rem' }}>
                <div style={{ fontSize:13, color:'#64748B', marginBottom:4 }}>{s.label}</div>
                <div style={{ fontSize:22, fontWeight:700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:'1.25rem' }}>
            <div style={{ background:'#fff', borderRadius:12, padding:'1.25rem' }}>
              <div style={{ fontWeight:600, marginBottom:'1rem' }}>Pedidos últimos 7 días</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ultimos7}>
                  <XAxis dataKey="dia" tick={{fontSize:12}} />
                  <YAxis tick={{fontSize:12}} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="pedidos" fill="#2563EB" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background:'#fff', borderRadius:12, padding:'1.25rem' }}>
              <div style={{ fontWeight:600, marginBottom:'1rem' }}>Tipo de entrega</div>
              {porEntrega.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={porEntrega} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {porEntrega.map((e,i) => <Cell key={i} fill={COLORES[i]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign:'center', padding:'2rem', color:'#94A3B8', fontSize:14 }}>Sin datos</div>
              )}
            </div>
          </div>

          <div style={{ background:'#fff', borderRadius:12, padding:'1.25rem' }}>
            <div style={{ fontWeight:600, marginBottom:'1rem' }}>Historial de ingresos (últimos 7 días)</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ultimos7}>
                <XAxis dataKey="dia" tick={{fontSize:12}} />
                <YAxis tick={{fontSize:12}} />
                <Tooltip formatter={(v) => [`Bs. ${v}`, 'Ingresos']} />
                <Bar dataKey="ingresos" fill="#10B981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
