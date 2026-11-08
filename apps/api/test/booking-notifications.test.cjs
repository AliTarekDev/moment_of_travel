const { test } = require('node:test');
const assert = require('node:assert/strict');
require('ts-node').register({ project: 'apps/api/tsconfig.json' });
const nodemailer = require('nodemailer');
const { ConfigService } = require('@nestjs/config');
const { Logger } = require('@nestjs/common');
const { BookingNotificationsService } = require('../src/bookings/booking-notifications.service');
const { BookingsService } = require('../src/bookings/bookings.service');

const booking = {
  reference: 'ANC-2026-123456', customerName: 'Test Traveller',
  customerEmail: 'traveller@example.com', customerPhone: '', serviceType: 'tour',
  destination: 'Luxor', travelers: 2, customerNotes: 'Tailor-made answers: <test>',
};

test('request notifications and persistence', async (t) => {
  const originalTransport = nodemailer.createTransport;
  const originalError = Logger.prototype.error;
  const originalLog = Logger.prototype.log;
  const originalFetch = global.fetch;
  t.after(() => {
    nodemailer.createTransport = originalTransport;
    Logger.prototype.error = originalError;
    Logger.prototype.log = originalLog;
    global.fetch = originalFetch;
  });
  Logger.prototype.error = () => {};
  Logger.prototype.log = () => {};
  const config = { MAIL_ENABLED: 'true', SMTP_AUTH: 'password', SMTP_PASSWORD: 'test-only' };
  const notifications = new BookingNotificationsService(new ConfigService(config));

  await t.test('disabled notifications never connect to SMTP', async () => {
    nodemailer.createTransport = () => { throw new Error('Should not connect'); };
    await new BookingNotificationsService(new ConfigService()).notifyNewBooking(booking);
  });

  await t.test('STARTTLS, recipient, reply address and full notes are passed to SMTP', async () => {
    let options, message;
    nodemailer.createTransport = (value) => {
      options = value;
      return { sendMail: async (value) => { message = value; return { accepted: ['info@ancientpathseg.com'], rejected: [] }; } };
    };
    await notifications.notifyNewBooking(booking);
    assert.equal(options.host, 'smtp.gmail.com');
    assert.equal(options.port, 587);
    assert.equal(options.requireTLS, true);
    assert.equal(options.secure, false);
    assert.equal(message.to, 'info@ancientpathseg.com');
    assert.equal(message.from.address, 'tali6184@gmail.com');
    assert.equal(options.auth.user, 'tali6184@gmail.com');
    assert.equal(options.auth.pass, 'test-only');
    assert.equal(message.replyTo, booking.customerEmail);
    assert.ok(message.text.includes(booking.customerNotes));
    assert.ok(message.subject.includes(booking.reference));
  });

  await t.test('OAuth obtains an Exchange token and uses XOAUTH2', async () => {
    let options, tokenRequest;
    global.fetch = async (url, init) => {
      tokenRequest = { url, init };
      return { ok: true, json: async () => ({ access_token: 'test-token' }) };
    };
    nodemailer.createTransport = (value) => {
      options = value;
      return { sendMail: async () => ({ accepted: ['info@ancientpathseg.com'], rejected: [] }) };
    };
    await new BookingNotificationsService(new ConfigService({
      MAIL_ENABLED: 'true', SMTP_AUTH: 'oauth2', SMTP_HOST: 'smtp.office365.com',
      SMTP_USER: 'info@ancientpathseg.com', SMTP_OAUTH_TENANT_ID: 'test-tenant',
      SMTP_OAUTH_CLIENT_ID: 'test-client', SMTP_OAUTH_CLIENT_SECRET: 'test-secret',
    })).notifyNewBooking(booking);
    assert.equal(tokenRequest.url, 'https://login.microsoftonline.com/test-tenant/oauth2/v2.0/token');
    assert.equal(tokenRequest.init.body.get('scope'), 'https://outlook.office365.com/.default');
    assert.equal(tokenRequest.init.body.get('grant_type'), 'client_credentials');
    assert.equal(options.auth.type, 'OAuth2');
    assert.equal(options.auth.accessToken, 'test-token');
  });

  await t.test('SMTP failures do not reject a saved request', async () => {
    nodemailer.createTransport = () => ({ sendMail: async () => { throw new Error('SMTP unavailable'); } });
    const events = [];
    const repository = {
      create: (value) => value, existsBy: async () => false,
      save: async (value) => { events.push('save'); return value; },
    };
    const service = new BookingsService(repository, {}, {
      notifyNewBooking: async (value) => { events.push('notify'); await notifications.notifyNewBooking(value); },
    });
    const result = await service.createPublic({ ...booking, customerPhone: '123' });
    assert.match(result.reference, /^ANC-\d{4}-\d{6}$/);
    assert.deepEqual(events, ['save', 'notify']);
    repository.save = async () => { throw new Error('Database unavailable'); };
    events.length = 0;
    await assert.rejects(service.createPublic({ ...booking, customerPhone: '123' }), /Database unavailable/);
    assert.deepEqual(events, []);
  });
});
