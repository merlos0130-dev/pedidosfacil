import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function Configuracion({ negocio, setNegocio, session, onCerrarSesion }) {
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [qrPreview, setQrPreview] = useState(negocio?.qr_url || null);
  const [infoTransferencia, setInfoTransferencia] = useState(negocio?.info_transferencia || '');
  const [exito, setExito] = useState('');

  const subirQR = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendo(true);
    const ext = file.name.split('.').pop();
    const nombre = `qr-${negocio.id}.${ext}`;
    const { error } = await supabase.storage.from('productos').upload(nombre, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('productos').getPublicUrl(nombre);
      setQrPreview(data.publicUrl);
      await supabase.from('negocios').update({ qr_url: data.publicUrl }).eq('id', negocio.id);
      setNegocio(prev => ({ ...prev, qr_url: data.publicUrl }));
      setExito('QR guardado correctamente');
      setTimeout(() => setExito(''), 3000);
    }
    setSubiendo(false);
  };

  const guardarTransferencia = async () => {
    setGuardando(true);
    await supabase.from('negocios').update({ info_transferencia: infoTransferencia }).eq('id', negocio.id);
    setNegocio(prev => ({ ...prev, info_transferencia: infoTransferencia }));
    setExito('Información guardada');
    setTimeout(() => setExito(''), 3000);
    setGuardando(false);
  };

  return (
    <div style={{ padding:'1.5rem' }}>
      <h1 style={{ fontSize:20, fontWeight:700, marginBottom:'1.25rem' }}>Configuración</h1>

      <div style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:520 }}>

        {/* Info del negocio */}
        <div style={{ background:'#fff', borderRadius:12, padding:'1.25rem' }}>
          <div style={{ fontWeight:600, marginBottom:'1rem' }}>Datos del negocio</div>
          <p style={{ fontSize:14, color:'#64748B', marginBottom:6 }}>Negocio: <strong>{negocio?.nombre}</strong></p>
          <p style={{ fontSize:14, color:'#64748B', marginBottom:6 }}>Tipo: <strong>{negocio?.tipo}</strong></p>
          <p style={{ fontSize:14, color:'#64748B', marginBottom:'1rem' }}>Email: <strong>{session?.user?.email}</strong></p>
          <div style={{ background:'#F0FDF4', borderRadius:10, padding:'1rem' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#15803D', marginBottom:6 }}>🔗 Link para tus clientes:</div>
            <div style={{ fontSize:12, color:'#166534', wordBreak:'break-all', fontFamily:'monospace', userSelect:'all' }}>
              https://pedidosfacil-clientes-ik7spiizb-merlos1.vercel.app?negocio={negocio?.id}
            </div>
          </div>
        </div>

        {/* QR de pago */}
        <div style={{ background:'#fff', borderRadius:12, padding:'1.25rem' }}>
          <div style={{ fontWeight:600, marginBottom:4 }}>📱 Código QR para pagos</div>
          <div style={{ fontSize:13, color:'#94A3B8', marginBottom:'1rem' }}>Sube tu QR de Tigo Money, Simple o el que uses. Los clientes lo verán al elegir pago por QR.</div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            {qrPreview ? (
              <img src={qrPreview} alt="QR de pago" style={{ width:120, height:120, borderRadius:12, objectFit:'cover', border:'2px solid #E2E8F0' }} />
            ) : (
              <div style={{ width:120, height:120, borderRadius:12, background:'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, border:'2px dashed #CBD5E1' }}>📱</div>
            )}
            <div>
              <label style={{ display:'block', padding:'10px 18px', borderRadius:8, border:'1.5px solid #2563EB', color:'#2563EB', fontWeight:600, cursor:'pointer', fontSize:13, marginBottom:8, textAlign:'center' }}>
                {subiendo ? 'Subiendo...' : qrPreview ? 'Cambiar QR' : 'Subir QR'}
                <input type="file" accept="image/*" onChange={subirQR} style={{ display:'none' }} />
              </label>
              {qrPreview && (
                <button onClick={async()=>{ await supabase.from('negocios').update({qr_url:null}).eq('id',negocio.id); setQrPreview(null); setNegocio(p=>({...p,qr_url:null})); }}
                  style={{ width:'100%', padding:'8px', borderRadius:8, border:'1px solid #FCA5A5', background:'#FEF2F2', color:'#DC2626', cursor:'pointer', fontSize:12 }}>
                  Quitar QR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info transferencia */}
        <div style={{ background:'#fff', borderRadius:12, padding:'1.25rem' }}>
          <div style={{ fontWeight:600, marginBottom:4 }}>🏦 Datos para transferencia</div>
          <div style={{ fontSize:13, color:'#94A3B8', marginBottom:'1rem' }}>Banco, número de cuenta, nombre del titular. Los clientes verán esto al elegir transferencia.</div>
          <textarea value={infoTransferencia} onChange={e=>setInfoTransferencia(e.target.value)}
            placeholder="Ej: Banco BCP&#10;Cuenta: 123-456789&#10;Titular: Juan Pérez&#10;CI: 12345678"
            rows={4}
            style={{ width:'100%', padding:'12px', borderRadius:10, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none', resize:'none', marginBottom:10 }} />
          <button onClick={guardarTransferencia} disabled={guardando}
            style={{ padding:'8px 20px', borderRadius:8, border:'none', background:'#2563EB', color:'#fff', fontWeight:600, cursor:'pointer', fontSize:14 }}>
            {guardando ? 'Guardando...' : 'Guardar datos'}
          </button>
        </div>

        {exito && (
          <div style={{ background:'#F0FDF4', border:'1px solid #86EFAC', borderRadius:10, padding:'12px 16px', color:'#15803D', fontWeight:500, fontSize:14 }}>
            ✅ {exito}
          </div>
        )}

        <div style={{ background:'#fff', borderRadius:12, padding:'1.25rem' }}>
          <div style={{ fontWeight:600, marginBottom:'1rem' }}>Sesión</div>
          <button onClick={onCerrarSesion}
            style={{ padding:'8px 20px', borderRadius:8, border:'1px solid #FCA5A5', background:'#FEF2F2', color:'#DC2626', fontWeight:600, cursor:'pointer', fontSize:14 }}>
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
