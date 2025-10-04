import { createClient } from '@/utils/supabase/server'

export default async function TestConnectionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return <div>Welcome, {user?.email}</div>
}
