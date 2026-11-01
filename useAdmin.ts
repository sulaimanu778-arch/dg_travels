import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export function useAdmin() {
  const [state, setState] = useState<'checking' | 'yes' | 'no'>('checking')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user.id
      if (!uid) {
        setState('no')
        return
      }
      const { data: rows } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', uid)
        .eq('role', 'admin')
      setState(rows && rows.length > 0 ? 'yes' : 'no')
    })
  }, [])

  return state
}
