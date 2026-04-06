export const TEMP_MAIL_DOMAINS = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'yopmail.com',
    'temp-mail.org',
    'throwawaymail.com',
    'tempmailaddress.com',
    'mohmal.com'
];

export function isTempMail(email: string): boolean {
    if (!email || !email.includes('@')) return false;
    const domain = email.split('@')[1].toLowerCase();

    return TEMP_MAIL_DOMAINS.includes(domain);
}
