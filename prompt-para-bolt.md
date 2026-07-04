# Prompt para pegar en Bolt.new

Crea una aplicación web completa llamada **PedidosFácil** — un panel de gestión de pedidos para negocios (restaurantes, farmacias y tiendas). Usa React + Tailwind CSS.

## Estructura de la app

### 1. Sidebar de navegación
- Logo "PedidosFácil" con ícono de bolsa
- Menú: Inicio, Pedidos, Productos, Clientes, Reportes, Configuración
- Nombre del negocio y tipo abajo del logo

### 2. Dashboard principal (página de inicio)
Métricas en tarjetas:
- Pedidos hoy (número grande)
- Ingresos del día en Bs.
- Pedidos en preparación (color amarillo)
- Tiempo promedio de entrega en minutos

### 3. Tabla de pedidos
Columnas: ID, Cliente, Tipo de negocio, Productos, Total, Estado, Acciones

Estados posibles con colores:
- "Nuevo" → amarillo
- "En preparación" → azul
- "Listo" → verde
- "Entregado" → gris

Acciones por pedido:
- Ver detalle (abre modal con info completa)
- Cambiar estado (botón que avanza al siguiente estado)
- Cancelar pedido

### 4. Modal de detalle del pedido
Muestra:
- Info del cliente (nombre, teléfono, dirección)
- Lista de productos con cantidades y precios
- Subtotal, delivery y total
- Timeline del estado del pedido
- Botones: Imprimir, Cambiar estado, Cerrar

### 5. Página de Productos
- Grid de productos con imagen (emoji), nombre, precio, categoría
- Botón para agregar nuevo producto
- Toggle para activar/desactivar producto
- Editar precio

### 6. Página de Clientes
- Lista de clientes con nombre, teléfono, total de pedidos, último pedido
- Buscador por nombre

### 7. Página de Reportes
- Gráfico de barras de pedidos por día (últimos 7 días)
- Gráfico de torta por tipo de negocio
- Tabla de productos más vendidos

## Datos de ejemplo incluidos

### Pedidos de ejemplo:
```
#0142 - María López - Hamburguesa doble + papas fritas - Bs. 87 - Nuevo
#0141 - Carlos Mamani - Ibuprofeno 400mg x2 + Vitamina C - Bs. 145 - En preparación  
#0140 - Ana Quispe - Arroz 5kg + Aceite 1L + Azúcar 2kg - Bs. 230 - Listo
#0139 - Luis Torres - Pizza familiar + refresco 2L - Bs. 55 - En preparación
#0138 - Rosa Flores - Paracetamol + suero oral - Bs. 89 - Entregado
#0137 - Pedro Vargas - Detergente + jabón + papel higiénico - Bs. 312 - Entregado
```

### Productos de ejemplo (mezcla de los 3 tipos):
Comida: Hamburguesa (Bs. 45), Pizza familiar (Bs. 85), Salteñas x6 (Bs. 18)
Farmacia: Ibuprofeno 400mg (Bs. 12), Paracetamol 500mg (Bs. 8), Vitamina C (Bs. 25)
Tienda: Arroz 5kg (Bs. 45), Aceite 1L (Bs. 22), Detergente (Bs. 35)

## Diseño
- Colores: blanco y gris claro de fondo, azul (#2563EB) como color principal
- Tipografía limpia, sans-serif
- Sidebar oscuro (#1E293B) con texto blanco
- Tarjetas con sombra suave
- Completamente responsivo para móvil y desktop
- Notificación visual cuando llega un "nuevo pedido" (simular cada 30 segundos)

## Funcionalidades interactivas reales
- Filtrar pedidos por estado
- Buscar pedidos por nombre de cliente o ID
- Cambiar estado de pedido con un clic (avanza: Nuevo → En prep → Listo → Entregado)
- Agregar producto nuevo con formulario
- Contador de pedidos nuevos en el ícono de la campana
- Sonido de notificación al llegar pedido nuevo (usar Web Audio API)

Genera todo en un solo proyecto React funcional con componentes separados por archivo.
