-- Lazo Society 2.0 · esquema inicial
-- Todo se lee y escribe desde el servidor (clave service_role). RLS activado sin políticas públicas:
-- nadie con la clave anónima puede leer ni escribir nada.

create extension if not exists pgcrypto;

create table public.socios (
  codigo        text primary key,
  nombre        text not null,
  email         text not null,
  comision      numeric(4,3) not null default 0.10,
  descuento     numeric(4,3) not null default 0.05,
  activo        boolean not null default true,
  creado_en     timestamptz not null default now()
);

create table public.bodas (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text unique not null,
  novios               text not null,
  fecha                date not null,
  lugar                text,
  email_contacto       text not null,
  telefono             text,
  invitados            int  not null check (invitados between 10 and 2000),
  edad_novios          int  not null check (edad_novios between 18 and 99),
  parte_amigos         numeric(3,2) not null check (parte_amigos between 0 and 1),
  solteros_estimados   int  not null,
  solteros_declarados  int,
  pack                 text not null,
  precio               int  not null,
  codigo_socio         text references public.socios(codigo),
  direccion_envio      text,
  estado               text not null default 'solicitada'
                       check (estado in ('solicitada','confirmada','test_abierto','test_cerrado','en_produccion','enviada','celebrada','cancelada')),
  cierre_test          date generated always as (fecha - 14) stored,
  creado_en            timestamptz not null default now()
);

create table public.solteros (
  id               uuid primary key default gen_random_uuid(),
  boda_id          uuid references public.bodas(id) on delete cascade,   -- null = test público
  nombre           text not null,
  email            text not null,
  mayor_edad       boolean not null check (mayor_edad),
  acepta_juego     boolean not null check (acepta_juego),
  acepta_society   boolean not null default false,
  respuestas       smallint[] not null check (array_length(respuestas, 1) = 17),
  animal           text not null check (animal in ('caballo','halcon','lobo','lince','ciervo','cisne')),
  toque            text not null check (toque in ('caballo','halcon','lobo','lince','ciervo','cisne')),
  calibracion      text not null,
  origen           text not null check (origen in ('antes','en_la_boda','publico')),
  te_ves           smallint check (te_ves between 1 and 5),
  creado_en        timestamptz not null default now()
);
create unique index solteros_boda_email on public.solteros (boda_id, lower(email)) where boda_id is not null;
create index solteros_boda on public.solteros (boda_id);

-- Censo agregado por boda (lo único que ve la pareja)
create view public.censo as
  select boda_id, animal, count(*)::int as total
  from public.solteros where boda_id is not null
  group by boda_id, animal;

alter table public.socios   enable row level security;
alter table public.bodas    enable row level security;
alter table public.solteros enable row level security;
