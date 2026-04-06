import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { sendForkRequestEmail } from '@/lib/email/resend';

export async function POST(req: Request) {
    try {
        const { shortcutId, ownerId, shortcutTitle } = await req.json();
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

        const { data: requestParams, error: reqError } = await supabase
            .from('fork_requests')
            .insert({
                source_shortcut_id: shortcutId,
                requester_id: user.id,
                owner_id: ownerId,
                status: 'PENDING'
            })
            .select()
            .single();

        if (reqError) throw reqError;

        await supabase.from('notifications').insert({
            user_id: ownerId,
            type: 'FORK_REQUEST',
            message: `${user.email} asked to fork your shortcut!`,
            link: `/dashboard/forks/${requestParams.id}`
        });

        const { data: profile } = await supabase.from('profiles').select('email').eq('id', ownerId).single();
        if (profile?.email) {
            await sendForkRequestEmail(profile.email, user.email || 'A user', shortcutTitle || 'Shortcut');
        }

        return NextResponse.json({ success: true, data: requestParams });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
