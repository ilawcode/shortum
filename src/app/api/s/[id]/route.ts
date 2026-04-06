import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();

        // Bridge typically uses Service Role if RLS does not allow public reads by ID,
        // but anon is used to test securely first.
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

        const { data: shortcut, error } = await supabase
            .from('shortcuts')
            .select('content_json')
            .eq('id', id)
            .single();

        if (error || !shortcut) {
            const { data: slugShortcut, error: slugError } = await supabase
                .from('shortcuts')
                .select('id, content_json')
                .eq('share_slug', id)
                .single();

            if (slugError || !slugShortcut) {
                return NextResponse.json({ error: 'Shortcut not found' }, { status: 404 });
            }

            await supabase.rpc('increment_download_count', { target_shortcut_id: slugShortcut.id });
            return NextResponse.json(slugShortcut.content_json);
        }

        await supabase.rpc('increment_download_count', { target_shortcut_id: id });

        return NextResponse.json(shortcut.content_json);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
