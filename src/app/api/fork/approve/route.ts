import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { forkRequestId } = await req.json();
        const cookieStore = await cookies();
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
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: forkReq, error: reqErr } = await supabase
            .from('fork_requests')
            .update({ status: 'APPROVED' })
            .eq('id', forkRequestId)
            .eq('owner_id', user.id)
            .select('*, shortcuts(content_json, title)')
            .single();

        if (reqErr || !forkReq) throw new Error("Could not approve fork request.");

        const { data: newShortcut, error: cloneErr } = await supabase
            .from('shortcuts')
            .insert({
                title: `${(forkReq.shortcuts as any).title} (Forked)`,
                content_json: (forkReq.shortcuts as any).content_json,
                creator_id: forkReq.requester_id,
                is_public: false
            })
            .select()
            .single();

        if (cloneErr) throw cloneErr;

        await supabase.from('notifications').insert({
            user_id: forkReq.requester_id,
            type: 'FORK_APPROVED',
            message: `Your fork request for '${(forkReq.shortcuts as any).title}' was approved!`,
            link: `/editor/${newShortcut.id}`
        });

        return NextResponse.json({ success: true, newShortcutId: newShortcut.id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
