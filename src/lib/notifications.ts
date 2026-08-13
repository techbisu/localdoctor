import { Resend } from "resend";

export interface NotificationPayload {
  to: string;
  subject: string;
  body: string;
  type: "email" | "sms" | "whatsapp" | "push";
}

export interface NotificationProvider {
  send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }>;
}

class EmailProvider implements NotificationProvider {
  private resend: Resend | null = null;

  constructor() {
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }
  }

  async send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
    if (!this.resend) {
      console.log("[EMAIL MOCK]", payload.to, payload.subject, payload.body);
      return { success: true };
    }

    try {
      await this.resend.emails.send({
        from: process.env.EMAIL_FROM || "noreply@healthfind.app",
        to: payload.to,
        subject: payload.subject,
        text: payload.body,
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}

class SMSProvider implements NotificationProvider {
  async send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
    console.log("[SMS MOCK]", payload.to, payload.body);
    return { success: true };
  }
}

class WhatsAppProvider implements NotificationProvider {
  async send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
    console.log("[WHATSAPP MOCK]", payload.to, payload.body);
    return { success: true };
  }
}

class ConsoleProvider implements NotificationProvider {
  async send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
    console.log(`[${payload.type.toUpperCase()}]`, payload.to, payload.subject, payload.body);
    return { success: true };
  }
}

export function getNotificationProvider(type: "email" | "sms" | "whatsapp" | "push"): NotificationProvider {
  switch (type) {
    case "email":
      return new EmailProvider();
    case "sms":
      return new SMSProvider();
    case "whatsapp":
      return new WhatsAppProvider();
    default:
      return new ConsoleProvider();
  }
}

export async function sendNotification(payload: NotificationPayload) {
  const provider = getNotificationProvider(payload.type);
  return provider.send(payload);
}
