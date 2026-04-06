-- Database RPC for Atomic Credit Consumption AND shortcut project generation
-- We assume the user creates an initial shortcut project when they enter the editor.

CREATE OR REPLACE FUNCTION create_project_with_credit
(user_uuid uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_credits integer;
  v_new_project_id uuid;
BEGIN
    -- 1. Get current credits with Row Lock to avoid race conditions
    SELECT credits
    INTO v_current_credits
    FROM public.profiles
    WHERE id = user_uuid
    FOR
    UPDATE;

    -- 2. Validate credits
    IF v_current_credits IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
END
IF;

  IF v_current_credits < 1 THEN
    RAISE EXCEPTION 'Insufficient credits';
END
IF;

  -- 3. Deduct credit
  UPDATE public.profiles
  SET credits = credits - 1
  WHERE id = user_uuid;

-- 4. Create new shortcut project shell
INSERT INTO public.shortcuts
    (creator_id, share_slug, title, description, content_json, is_public)
VALUES
    (user_uuid, encode(gen_random_bytes(8), 'hex'), 'Untitled Shortcut', '', '[]', false)
-- Dummy hex instead of nanoid inside pg function
RETURNING id INTO v_new_project_id;

-- 5. Return success result
RETURN json_build_object(
    'new_project_id', v_new_project_id,
    'remaining_credits', v_current_credits - 1
  );
END;
$$;
