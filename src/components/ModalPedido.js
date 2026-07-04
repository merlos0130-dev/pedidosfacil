import React from 'react';

const estadoConfig = {
  nuevo:      { label:'Nuevo',          color:'#F59E0B', bg:'#FEF3C7', siguiente:'preparacion' },
  preparacion:{ label:'En preparación', color:'#3B82F6', bg:'#DBEAFE', siguiente:'listo'       },
  listo:      { label:'Listo',          color:'#10B981', bg:'#D1FAE5', siguiente:'entregado'   },
  entregado:  { label:'Entregado',      color:'#6B7280', bg:'#F3F4F6', siguiente:null          },
};

const metodoPagoLabel = {
  efectivo: '💵 Efectivo',
  qr: '📱 QR',
  transferencia: '🏦 Transferencia',
};

export default function ModalPedido({ pedido, onClose, onCambiarEstado }) {
  if (!pedido) return null;
  const cfg = estadoConfig[pedido.estado] || estadoConfig.nuevo;
  const pasos = ['nuevo','preparacion','listo','entregado'];

  let productos = [];
  try { productos = Array.isArray(pedido.productos) ? pedido.productos : JSON.parse(pedido.productos || '[]'); } catch(e) {}

  const subtotal = productos.reduce((s,x) => s+(x.cant||1)*x.precio, 0);
  const descuento = Number(pedido.descuento) || 0;
  const esDelivery = pedido.nota && pedido.nota.includes('DELIVERY');
  const esRecoger = pedido.nota && pedido.nota.includes('RECOGER');
  const metodoPago = pedido.metodo_pago || 'efectivo';
  const tieneComprobante = !!pedido.comprobante_url;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ padding:'1.25rem', borderBottom:'1px solid #F1F5F9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontWeight:700, fontSize:17 }}>Detalle del pedido</div>
            <div style={{ fontSize:12, color:'#94A3B8', marginTop:2 }}>{new Date(pedido.created_at).toLocaleString('es-BO')}</div>
          </div>
          <button onClick={onClose} style={{ border:'none', background:'#F1F5F9', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:16, color:'#64748B' }}>✕</button>
        </div>

        <div style={{ padding:'1.25rem', display:'flex', flexDirection:'column', gap:12 }}>
          {/* Badges */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <span style={{ background: esDelivery?'#EFF6FF':'#F0FDF4', color: esDelivery?'#2563EB':'#10B981', padding:'5px 12px', borderRadius:99, fontSize:13, fontWeight:600 }}>
              {esDelivery ? '🚚 Delivery' : esRecoger ? '🏪 Recoger en local' : '📦 Pedido'}
            </span>
            <span style={{ background:'#F5F3FF', color:'#7C3AED', padding:'5px 12px', borderRadius:99, fontSize:13, fontWeight:600 }}>
              {metodoPagoLabel[metodoPago] || '💵 Efectivo'}
            </span>
            {tieneComprobante && (
              <span style={{ background:'#F0FDF4', color:'#059669', padding:'5px 12px', borderRadius:99, fontSize:13, fontWeight:600 }}>
                ✅ Comprobante adjunto
              </span>
            )}
            {pedido.cupon_codigo && (
              <span style={{ background:'#FEF3C7', color:'#92400E', padding:'5px 12px', borderRadius:99, fontSize:13, fontWeight:600 }}>
                🎟 {pedido.cupon_codigo}
              </span>
            )}
          </div>

          {/* Comprobante de pago */}
          {tieneComprobante && (
            <div style={{ background:'#F0FDF4', borderRadius:12, padding:'1rem' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#059669', marginBottom:8 }}>📎 Comprobante de pago:</div>
              <img src={pedido.comprobante_url} alt="Comprobante" style={{ width:'100%', maxHeight:200, objectFit:'contain', borderRadius:10, border:'1px solid #86EFAC', cursor:'pointer' }}
                onClick={()=>window.open(pedido.comprobante_url, '_blank')} />
              <div style={{ fontSize:12, color:'#64748B', marginTop:6, textAlign:'center' }}>Toca para ver en tamaño completo</div>
            </div>
          )}

          {!tieneComprobante && metodoPago !== 'efectivo' && (
            <div style={{ background:'#FEF3C7', borderRadius:12, padding:'10px 14px', fontSize:13, color:'#92400E', fontWeight:500 }}>
              ⚠️ El cliente eligió {metodoPagoLabel[metodoPago]} pero no adjuntó comprobante. Verifica el pago antes de entregar.
            </div>
          )}

          {/* Cliente */}
          <div style={{ background:'#F8FAFC', borderRadius:12, padding:'1rem' }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#94A3B8', marginBottom:8 }}>CLIENTE</div>
            <div style={{ fontWeight:600, fontSize:15, marginBottom:4 }}>{pedido.cliente_nombre}</div>
            {pedido.cliente_telefono && <div style={{ fontSize:13, color:'#64748B', marginBottom:2 }}>📞 {pedido.cliente_telefono}</div>}
            {pedido.cliente_direccion && pedido.cliente_direccion !== 'Recoge en local' && (
              <div style={{ fontSize:13, color:'#64748B' }}>
                📍 {pedido.cliente_direccion.startsWith('https://maps') ? (
                  <a href={pedido.cliente_direccion} target="_blank" rel="noreferrer" style={{ color:'#2563EB', fontWeight:600 }}>Ver en Google Maps →</a>
                ) : pedido.cliente_direccion}
              </div>
            )}
          </div>

          {/* Productos */}
          {productos.length > 0 && (
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'#94A3B8', marginBottom:8 }}>PRODUCTOS</div>
              {productos.map((p,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #F1F5F9', fontSize:14 }}>
                  <span>{p.cant||1}x {p.nombre}</span>
                  <span style={{ fontWeight:600 }}>Bs. {(p.cant||1)*p.precio}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:13, color:'#94A3B8' }}><span>Subtotal</span><span>Bs. {subtotal}</span></div>
              {esDelivery && <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:13, color:'#94A3B8' }}><span>Delivery</span><span>Bs. 15</span></div>}
              {descuento > 0 && <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:13, color:'#10B981', fontWeight:600 }}><span>🎟 Descuento</span><span>-Bs. {descuento}</span></div>}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', fontWeight:800, fontSize:16, borderTop:'2px solid #1E293B', marginTop:4 }}>
                <span>Total</span><span>Bs. {pedido.total}</span>
              </div>
            </div>
          )}

          {/* Nota */}
          {pedido.nota && (
            <div style={{ background:'#FFFBEB', borderRadius:10, padding:'10px 12px', fontSize:13, color:'#92400E' }}>
              📝 {pedido.nota}
            </div>
          )}

          {/* Timeline */}
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:'#94A3B8', marginBottom:10 }}>ESTADO DEL PEDIDO</div>
            <div style={{ display:'flex', gap:4 }}>
              {pasos.map((paso,i) => {
                const c = estadoConfig[paso];
                const activo = pasos.indexOf(pedido.estado) >= i;
                return (
                  <div key={paso} style={{ flex:1, textAlign:'center' }}>
                    <div style={{ width:30, height:30, borderRadius:'50%', background:activo?c.color:'#E2E8F0', margin:'0 auto 4px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#fff', fontWeight:800 }}>{i+1}</div>
                    <div style={{ fontSize:10, color:activo?c.color:'#94A3B8', fontWeight:activo?600:400, lineHeight:1.2 }}>{c.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Acciones */}
          <div style={{ display:'flex', gap:8 }}>
            {cfg.siguiente && (
              <button onClick={()=>{ onCambiarEstado(pedido.id, cfg.siguiente); onClose(); }}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:'#2563EB', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14 }}>
                Pasar a: {estadoConfig[cfg.siguiente].label} →
              </button>
            )}
            <button onClick={()=>window.print()}
              style={{ padding:'12px 16px', borderRadius:10, border:'1px solid #E2E8F0', background:'transparent', cursor:'pointer', fontSize:14 }}>
              🖨 Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
