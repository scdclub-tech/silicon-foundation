import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hedbvysyhxhrdstkriba.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZGJ2eXN5aHhocmRzdGtyaWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MTQ1NzcsImV4cCI6MjA5Njk5MDU3N30.vOZowq5em9PYAdDvgX3ZRNG0xxQTjp3BATfc06Zj8pM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)