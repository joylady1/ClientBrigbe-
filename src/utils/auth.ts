import { UserSession } from '../types';

export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + "_cb_secure_nigeria_salt_2026");
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function formatNaira(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₦0';
  return `₦${Math.round(num).toLocaleString('en-NG')}`;
}

export function formatNigerianPhone(phone: string): { international: string; local: string } {
  // Strip non-digits
  const digits = phone.replace(/\D/g, '');
  let cleaned = digits;
  
  if (cleaned.startsWith('234')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  const international = `234${cleaned}`;
  const local = `0${cleaned}`;
  return { international, local };
}

export function createWhatsAppUrl(
  phone: string, 
  proName: string, 
  serviceName: string = 'your services',
  clientName?: string
): string {
  const { international } = formatNigerianPhone(phone || '8000000000');
  const greeting = clientName 
    ? `Hello ${proName}, my name is ${clientName}. I found your profile on ClientBridge Nigeria.`
    : `Hello ${proName}, I discovered your profile on ClientBridge Nigeria.`;
  
  const inquiryText = `I would like to hire you for: ${serviceName}.\nPlease let me know your current availability and timeline.\nThank you!`;
  const message = encodeURIComponent(`${greeting}\n\n${inquiryText}`);
  return `https://wa.me/${international}?text=${message}`;
}

export function getStoredSession(): UserSession | null {
  try {
    const raw = localStorage.getItem("cb_session");
    if (!raw) return null;
    const session: UserSession = JSON.parse(raw);
    if (session && session.expiresAt && session.expiresAt < Date.now()) {
      localStorage.removeItem("cb_session");
      localStorage.removeItem("cb_current_view");
      return null;
    }
    return session;
  } catch {
    return null;
  }
}
