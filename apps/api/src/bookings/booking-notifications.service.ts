import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { Booking } from './booking.entity';

@Injectable()
export class BookingNotificationsService implements OnModuleInit {
  private readonly logger = new Logger(BookingNotificationsService.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    if (!this.enabled) this.logger.warn('Booking email notifications are disabled (MAIL_ENABLED is not true).');
  }

  private get enabled(): boolean {
    return this.config.get('MAIL_ENABLED', 'false') === 'true';
  }

  async notifyNewBooking(booking: Booking): Promise<void> {
    if (!this.enabled) return;

    try {
      const user = this.config.get('SMTP_USER', 'tali6184@gmail.com');
      const auth = this.config.get('SMTP_AUTH', 'password') === 'password'
        ? { user, pass: this.config.getOrThrow<string>('SMTP_PASSWORD') }
        : { type: 'OAuth2' as const, user, accessToken: await this.accessToken() };
      const transport = createTransport({
        host: this.config.get('SMTP_HOST', 'smtp.gmail.com'),
        port: Number(this.config.get('SMTP_PORT', '587')),
        secure: false,
        requireTLS: true,
        tls: { minVersion: 'TLSv1.2' },
        auth,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
      const result = await transport.sendMail({
        from: { name: 'Ancient Paths Requests', address: user },
        to: this.config.get('BOOKING_NOTIFICATION_TO', 'info@ancientpathseg.com'),
        replyTo: booking.customerEmail,
        subject: `New ${booking.serviceType.replace(/_/g, ' ')} request — ${booking.reference}`,
        text: [
          'A new request has been saved in the Ancient Paths dashboard.',
          '',
          `Reference: ${booking.reference}`,
          `Customer: ${booking.customerName}`,
          `Email: ${booking.customerEmail}`,
          `Phone: ${booking.customerPhone || 'Not provided'}`,
          `Service: ${booking.serviceType}`,
          `Destination: ${booking.destination}`,
          `Departure city: ${booking.departureCity || 'Not provided'}`,
          `Departure date: ${booking.departureDate || 'Not provided'}`,
          `Return date: ${booking.returnDate || 'Not provided'}`,
          `Trip type: ${booking.tripType || 'Not provided'}`,
          `Travellers: ${booking.travelers}`,
          `Urgent: ${booking.urgent ? 'Yes' : 'No'}`,
          `Includes tickets: ${booking.includesTickets ? 'Yes' : 'No'}`,
          `Includes hotels: ${booking.includesHotels ? 'Yes' : 'No'}`,
          `Includes transport: ${booking.includesTransport ? 'Yes' : 'No'}`,
          '',
          'Customer notes / questionnaire answers:',
          booking.customerNotes || 'None',
        ].join('\n'),
        disableFileAccess: true,
        disableUrlAccess: true,
      });
      if (!result.accepted.length || result.rejected.length) throw new Error('SMTP recipient rejected');
      this.logger.log(`Request notification accepted by SMTP for ${booking.reference}.`);
    } catch {
      // Do not expose SMTP credentials, tokens, or customer details in logs or public responses.
      this.logger.error(`Email notification failed for ${booking.reference}. The booking is saved; review mail configuration and follow up from the dashboard.`);
    }
  }

  private async accessToken(): Promise<string> {
    const tenant = this.config.getOrThrow<string>('SMTP_OAUTH_TENANT_ID');
    const response = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.config.getOrThrow<string>('SMTP_OAUTH_CLIENT_ID'),
        client_secret: this.config.getOrThrow<string>('SMTP_OAUTH_CLIENT_SECRET'),
        grant_type: 'client_credentials',
        scope: 'https://outlook.office365.com/.default',
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Microsoft SMTP token request failed');
    const token = await response.json() as { access_token?: string };
    if (!token.access_token) throw new Error('Microsoft SMTP token missing');
    return token.access_token;
  }
}
