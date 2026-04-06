'use server'

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createProjectWithCredit() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { }
            }
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const { data, error } = await supabase.rpc('create_project_with_credit', {
        user_uuid: user.id
    });

    if (error) {
        throw new Error(error.message || "Insufficient credits or connection error");
    }

    return data.new_project_id;
}
