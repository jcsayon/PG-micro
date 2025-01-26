// filepath: /c:/Users/Desktop PC/Documents/PG/src/context/SupabaseContext.js
import React, { createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlrzcwycrnactyxebrng.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scnpjd3ljcm5hY3R5eGVicm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4OTM1MjQsImV4cCI6MjA1MzQ2OTUyNH0.3E4cOlHUfHbd8Hv8IPaq-1RZsOY6NwOKcLRw2sz6AYk';
const supabase = createClient(supabaseUrl, supabaseKey);

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  return useContext(SupabaseContext);
};