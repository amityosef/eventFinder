import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface LeadNotificationData {
  venueName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: Date;
  guestsCount: number;
  eventType?: string;
  message?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('MAIL_HOST');
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.configService.get<number>('MAIL_PORT', 587),
        secure: false,
        auth: { user, pass },
      });
      this.isConfigured = true;
      this.logger.log('Mail service configured successfully');
    } else {
      this.logger.warn('Mail service not configured - emails will be logged only');
    }
  }

  async sendNewLeadNotification(
    to: string,
    data: LeadNotificationData,
  ): Promise<void> {
    const subject = `🎉 פנייה חדשה עבור ${data.venueName}`;

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #475569; }
          .value { color: #1e293b; margin-top: 5px; }
          .footer { background: #1e293b; color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; }
          .btn { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 פנייה חדשה!</h1>
            <p>התקבלה פנייה חדשה עבור ${data.venueName}</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 שם הלקוח:</div>
              <div class="value">${data.customerName}</div>
            </div>
            <div class="field">
              <div class="label">📧 אימייל:</div>
              <div class="value">${data.customerEmail}</div>
            </div>
            <div class="field">
              <div class="label">📱 טלפון:</div>
              <div class="value">${data.customerPhone}</div>
            </div>
            <div class="field">
              <div class="label">📅 תאריך האירוע:</div>
              <div class="value">${data.eventDate.toLocaleDateString('he-IL')}</div>
            </div>
            <div class="field">
              <div class="label">👥 מספר אורחים:</div>
              <div class="value">${data.guestsCount}</div>
            </div>
            ${data.eventType ? `
            <div class="field">
              <div class="label">🎊 סוג האירוע:</div>
              <div class="value">${data.eventType}</div>
            </div>
            ` : ''}
            ${data.message ? `
            <div class="field">
              <div class="label">💬 הודעה:</div>
              <div class="value">${data.message}</div>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>EventFinder - מצאו את המקום המושלם לאירוע שלכם</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendMail(to, subject, html);
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    if (!this.isConfigured) {
      this.logger.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}
