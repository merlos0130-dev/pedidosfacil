export const pedidosIniciales = [
  { id:'#0142', cliente:'María López', telefono:'71234567', direccion:'Av. Montes 345', tipo:'🍔 Comida', productos:[{nombre:'Hamburguesa doble',cant:1,precio:65},{nombre:'Papas fritas',cant:1,precio:22}], estado:'nuevo', hora:'14:32' },
  { id:'#0141', cliente:'Carlos Mamani', telefono:'76543210', direccion:'C. Loayza 120', tipo:'💊 Farmacia', productos:[{nombre:'Ibuprofeno 400mg',cant:2,precio:12},{nombre:'Vitamina C',cant:1,precio:25}], estado:'preparacion', hora:'14:28' },
  { id:'#0140', cliente:'Ana Quispe', telefono:'69871234', direccion:'Av. Arce 890', tipo:'🛒 Tienda', productos:[{nombre:'Arroz 5kg',cant:1,precio:45},{nombre:'Aceite 1L',cant:2,precio:22},{nombre:'Azúcar 2kg',cant:1,precio:18}], estado:'listo', hora:'14:15' },
  { id:'#0139', cliente:'Luis Torres', telefono:'72345678', direccion:'C. Potosí 67', tipo:'🍔 Comida', productos:[{nombre:'Pizza familiar',cant:1,precio:85},{nombre:'Refresco 2L',cant:1,precio:18}], estado:'preparacion', hora:'14:05' },
  { id:'#0138', cliente:'Rosa Flores', telefono:'65432198', direccion:'Av. 6 de Agosto 234', tipo:'💊 Farmacia', productos:[{nombre:'Paracetamol 500mg',cant:3,precio:8},{nombre:'Suero oral',cant:2,precio:12}], estado:'entregado', hora:'13:50' },
  { id:'#0137', cliente:'Pedro Vargas', telefono:'71987654', direccion:'C. Comercio 456', tipo:'🛒 Tienda', productos:[{nombre:'Detergente',cant:2,precio:35},{nombre:'Jabón x3',cant:1,precio:28},{nombre:'Papel higiénico',cant:1,precio:45}], estado:'entregado', hora:'13:30' },
];

export const productosIniciales = [
  { id:1, nombre:'Hamburguesa doble', precio:65, categoria:'Comida', emoji:'🍔', activo:true },
  { id:2, nombre:'Pizza familiar', precio:85, categoria:'Comida', emoji:'🍕', activo:true },
  { id:3, nombre:'Salteñas x6', precio:18, categoria:'Comida', emoji:'🥟', activo:true },
  { id:4, nombre:'Ibuprofeno 400mg', precio:12, categoria:'Farmacia', emoji:'💊', activo:true },
  { id:5, nombre:'Paracetamol 500mg', precio:8, categoria:'Farmacia', emoji:'💉', activo:true },
  { id:6, nombre:'Vitamina C', precio:25, categoria:'Farmacia', emoji:'🧴', activo:true },
  { id:7, nombre:'Arroz 5kg', precio:45, categoria:'Tienda', emoji:'🌾', activo:true },
  { id:8, nombre:'Aceite 1L', precio:22, categoria:'Tienda', emoji:'🫙', activo:true },
  { id:9, nombre:'Detergente', precio:35, categoria:'Tienda', emoji:'🧼', activo:true },
];

export const clientesIniciales = [
  { id:1, nombre:'María López', telefono:'71234567', direccion:'Av. Montes 345', pedidos:8, ultimo:'hoy', gasto:680 },
  { id:2, nombre:'Carlos Mamani', telefono:'76543210', direccion:'C. Loayza 120', pedidos:5, ultimo:'ayer', gasto:420 },
  { id:3, nombre:'Ana Quispe', telefono:'69871234', direccion:'Av. Arce 890', pedidos:12, ultimo:'hoy', gasto:1240 },
  { id:4, nombre:'Luis Torres', telefono:'72345678', direccion:'C. Potosí 67', pedidos:3, ultimo:'hace 2 días', gasto:210 },
  { id:5, nombre:'Rosa Flores', telefono:'65432198', direccion:'Av. 6 de Agosto 234', pedidos:7, ultimo:'ayer', gasto:560 },
];

export const ventasSemana = [
  { dia:'Lun', pedidos:32, ingresos:2100 },
  { dia:'Mar', pedidos:28, ingresos:1850 },
  { dia:'Mié', pedidos:41, ingresos:2780 },
  { dia:'Jue', pedidos:35, ingresos:2340 },
  { dia:'Vie', pedidos:52, ingresos:3600 },
  { dia:'Sáb', pedidos:61, ingresos:4200 },
  { dia:'Hoy', pedidos:47, ingresos:2340 },
];

export const estadoConfig = {
  nuevo:      { label:'Nuevo',         color:'#F59E0B', bg:'#FEF3C7', siguiente:'preparacion' },
  preparacion:{ label:'En preparación',color:'#3B82F6', bg:'#DBEAFE', siguiente:'listo'       },
  listo:      { label:'Listo',         color:'#10B981', bg:'#D1FAE5', siguiente:'entregado'   },
  entregado:  { label:'Entregado',     color:'#6B7280', bg:'#F3F4F6', siguiente:null          },
};
