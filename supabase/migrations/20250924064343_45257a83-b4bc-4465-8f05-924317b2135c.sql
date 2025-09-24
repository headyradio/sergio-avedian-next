-- Fix the security definer function by recreating it with SECURITY INVOKER
-- This function only updates timestamps, so it doesn't need elevated privileges

CREATE OR REPLACE FUNCTION public.update_cms_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY INVOKER  -- Changed from SECURITY DEFINER to SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;