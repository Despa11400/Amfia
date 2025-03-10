import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nlkdtixbltzvhtxhzvhi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sa2R0aXhibHR6dmh0eGh6dmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MzY4OTIsImV4cCI6MjA1NjAxMjg5Mn0.PhS5wpwY0ZoKycdKOOitvvxAKqH5oPhk-yythwo_qNQ'

export const supabase = createClient(supabaseUrl, supabaseKey) 