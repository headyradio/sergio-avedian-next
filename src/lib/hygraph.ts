import { supabase } from '@/integrations/supabase/client';

// Hygraph proxy through Supabase edge function
const hygraphProxy = async (query: string, variables?: any) => {
  try {
    console.log('Calling hygraph-proxy with query:', query);
    console.log('Variables:', variables);
    
    const { data, error } = await supabase.functions.invoke('hygraph-proxy', {
      body: { query, variables }
    });

    console.log('Supabase function response:', { data, error });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Hygraph proxy error: ${error.message}`);
    }

    if (data?.error) {
      console.error('Hygraph API error:', data.error);
      console.error('Hygraph debug info:', data.debug);
      throw new Error(`Hygraph API error: ${data.error}`);
    }

    if (data?.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    console.log('Successfully received data from Hygraph:', data);
    return data;
  } catch (error) {
    console.error('Error calling hygraph proxy:', error);
    throw error;
  }
};

// Export a client-like interface that matches GraphQLClient's request method
export const hygraphClient = {
  request: hygraphProxy
};

export default hygraphClient;