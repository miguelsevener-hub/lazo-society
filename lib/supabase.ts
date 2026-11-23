import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cliente: SupabaseClient<any, any, any> | null = null;

/** Cliente de servidor con la clave service_role, apuntando al esquema "lazo". Nunca se usa en el navegador. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function db(): SupabaseClient<any, any, any> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.");
  cliente ??= createClient(url, key, { auth: { persistSession: false }, db: { schema: "lazo" } });
  return cliente;
}

export const hayBaseDeDatos = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
