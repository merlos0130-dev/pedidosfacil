import React, { useState } from 'react';
import { supabase } from '../supabase';

const emojis = { Comida:'🍔', Farmacia:'💊', Tienda:'🛒', Otro:'📦' };
const categorias = ['Comida','Farmacia','Tienda','Otro'];

export default function Productos({ productos, onAgregarProducto, onToggleProducto, onEliminarProducto }) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevo, setNuevo] = useState({ nombre:'', precio:'', categoria:'Comida' });
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);

  const seleccionarFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const agregar = async () => {
    if (!nuevo.nombre || !nuevo.precio) return;
    setGuardando(true);
    let foto_url = null;
    if (fotoFile) {
      setSubiendo(true);
      const ext = fotoFile.name.split('.').pop();
      const nombre = `${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from('productos').upload(nombre, fotoFile, { upsert: true });
      if (!error) {
        const { data: urlData } = supabase.storage.from('productos').getPublicUrl(nombre);
        foto_url = urlData.publicUrl;
      }
      setSubiendo(false);
    }
    await onAgregarProducto({ nombre: nuevo.nombre, precio: Number(nuevo.precio), categoria: nuevo.categoria, emoji: emojis[nuevo.categoria], activo: true, foto_url });
    setNuevo({ nombre:'', precio:'', categoria:'Comida' });
    setPreview(null); setFotoFile(null);
    setMostrarForm(false); setGuardando(false);
  };

  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
        <h1 style={{ fontSize:20, fontWeight:700 }}>Productos</h1>
        <button onClick={()=>setMostrarForm(true)}
          style={{ padding:'8px 16px', borderRadius:8, border:'none', background:'#2563EB', color:'#fff', fontWeight:600, cursor:'pointer', fontSize:14 }}>
          + Agregar producto
        </button>
      </div>

      {mostrarForm && (
        <div style={{ background:'#fff', borderRadius:12, padding:'1.25rem', marginBottom:'1.25rem', border:'2px solid #2563EB' }}>
          <div style={{ fontWeight:600, marginBottom:'1rem' }}>Nuevo producto</div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={{ fontSize:13, color:'#64748B', display:'block', marginBottom:6 }}>Foto del producto</label>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              {preview ? (
                <img src={preview} alt="preview" style={{ width:80, height:80, borderRadius:10, objectFit:'cover', border:'1px solid #E2E8F0' }} />
              ) : (
                <div style={{ width:80, height:80, borderRadius:10, background:'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, border:'2px dashed #CBD5E1' }}>📷</div>
              )}
              <label style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #2563EB', color:'#2563EB', fontWeight:600, cursor:'pointer', fontSize:13 }}>
                {preview ? 'Cambiar foto' : 'Subir foto'}
                <input type="file" accept="image/*" onChange={seleccionarFoto} style={{ display:'none' }} />
              </label>
              {preview && <button onClick={()=>{setPreview(null);setFotoFile(null);}} style={{ border:'none', background:'transparent', color:'#EF4444', cursor:'pointer', fontSize:13 }}>✕ Quitar</button>}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:'1rem' }}>
            <input placeholder="Nombre del producto" value={nuevo.nombre} onChange={e=>setNuevo({...nuevo,nombre:e.target.value})}
              style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, outline:'none' }} />
            <input placeholder="Precio en Bs." type="number" value={nuevo.precio} onChange={e=>setNuevo({...nuevo,precio:e.target.value})}
              style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, outline:'none' }} />
            <select value={nuevo.categoria} onChange={e=>setNuevo({...nuevo,categoria:e.target.value})}
              style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #E2E8F0', fontSize:14, outline:'none' }}>
              {categorias.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={agregar} disabled={guardando}
              style={{ padding:'8px 20px', borderRadius:8, border:'none', background:'#2563EB', color:'#fff', fontWeight:600, cursor:'pointer', fontSize:14, opacity:guardando?0.7:1 }}>
              {subiendo?'Subiendo foto...':guardando?'Guardando...':'Guardar'}
            </button>
            <button onClick={()=>{setMostrarForm(false);setPreview(null);setFotoFile(null);}}
              style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #E2E8F0', background:'transparent', cursor:'pointer', fontSize:14 }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {productos.length === 0 ? (
        <div style={{ background:'#fff', borderRadius:12, padding:'3rem', textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
          <div style={{ fontWeight:600, marginBottom:6 }}>No tienes productos aún</div>
          <div style={{ fontSize:14, color:'#94A3B8' }}>Agrega tu primer producto con foto</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:12 }}>
          {productos.map(p => (
            <div key={p.id} style={{ background:'#fff', borderRadius:12, overflow:'hidden', border:`1px solid ${p.activo?'#E2E8F0':'#F1F5F9'}`, opacity:p.activo?1:0.65 }}>
              {p.foto_url ? (
                <img src={p.foto_url} alt={p.nombre} style={{ width:'100%', height:140, objectFit:'cover' }} />
              ) : (
                <div style={{ width:'100%', height:140, background:'linear-gradient(135deg,#EFF6FF,#F5F3FF)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48 }}>
                  {p.emoji||'📦'}
                </div>
              )}
              <div style={{ padding:'12px' }}>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{p.nombre}</div>
                <div style={{ fontSize:12, color:'#64748B', marginBottom:4 }}>{p.categoria}</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#2563EB', marginBottom:10 }}>Bs. {p.precio}</div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={()=>onToggleProducto(p.id, !p.activo)}
                    style={{ flex:1, padding:'6px', borderRadius:6, border:'1px solid #E2E8F0',
                      background: p.activo?'#F0FDF4':'#FEF2F2', color: p.activo?'#16A34A':'#DC2626', cursor:'pointer', fontSize:11, fontWeight:500 }}>
                    {p.activo ? '✅ Activo' : '❌ Inactivo'}
                  </button>
                  <button onClick={()=>onEliminarProducto(p.id)}
                    style={{ padding:'6px 10px', borderRadius:6, border:'1px solid #FCA5A5', background:'#FEF2F2', color:'#DC2626', cursor:'pointer', fontSize:12 }}>
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
