import { createClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()

export const configured = Boolean(url && key && /^https:\/\/.+/.test(url))
export const supabase = createClient(
  configured ? url! : 'https://placeholder.supabase.co',
  configured ? key! : 'placeholder'
)
