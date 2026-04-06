import { Resend } from 'resend';

// Initialize only if API key exists to avoid crashing
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendForkRequestEmail(ownerEmail: string, requesterName: string, shortcutTitle: string) {
    if (!resend) {
        console.warn("RESEND_API_KEY not set. Mocking email send:", { ownerEmail, requesterName, shortcutTitle });
        return;
    }

    try {
        await resend.emails.send({
            from: 'ShortcutHub <noreply@shortcuthub.app>',
            to: [ownerEmail],
            subject: `New Fork Request: ${shortcutTitle}`,
            html: `<p>Hello!</p><p><strong>${requesterName}</strong> wants to fork your shortcut <strong>${shortcutTitle}</strong>.</p><p>Please check your dashboard to approve or decline.</p>`,
        });
    } catch (error) {
        console.error("Failed to send Fork Request Email", error);
    }
}

export async function sendVerificationEmail(userEmail: string, otp: string) {
    if (!resend) {
        console.warn("RESEND_API_KEY not set. Mocking email send:", { userEmail, otp });
        return;
    }

    try {
        await resend.emails.send({
            from: 'ShortcutHub <noreply@shortcuthub.app>',
            to: [userEmail],
            subject: `Your Verification Code`,
            html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
        });
    } catch (error) {
        console.error("Failed to send Verification Email", error);
    }
}
