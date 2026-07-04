-- Tabla de negocios (empresas registradas)
create table negocios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  nombre text not null,
  tipo text default 'general',
  telefono text,
  direccion text,
  created_at timestamp with time zone default now()
);

-- Tabla de productos
create table productos (
  id uuid default gen_random_uuid() primary key,
  negocio_id uuid references negocios(id) on delete cascade,
  nombre text not null,
  precio numeric not null,
  categoria text,
  emoji text default '📦',
  activo boolean default true,
  created_at timestamp with time zone default now()
);

-- Tabla de pedidos
create table pedidos (
  id uuid default gen_random_uuid() primary key,
  negocio_id uuid references negocios(id) on delete cascade,
  cliente_nombre text not null,
  cliente_telefono text,
  cliente_direccion text,
  productos jsonb not null default '[]',
  estado text default 'nuevo',
  total numeric default 0,
  created_at timestamp with time zone default now()
);

-- Seguridad: cada negocio solo ve sus propios datos
alter table negocios enable row level security;
alter table productos enable row level security;
alter table pedidos enable row level security;

create policy "Negocio propio" on negocios for all using (auth.uid() = user_id);
create policy "Productos del negocio" on productos for all using (
  negocio_id in (select id from negocios where user_id = auth.uid())
);
create policy "Pedidos del negocio" on pedidos for all using (
  negocio_id in (select id from negocios where user_id = auth.uid())
);
