import nodemailer from 'nodemailer';
import { env } from '../lib/env';
import { HttpError } from '../utils/httpErrors';

let transporter: nodemailer.Transporter | null = null;

export function getMailTransporter(): nodemailer.Transporter {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) {
    throw new HttpError(
      503,
      'Envio de e-mail não configurado no servidor (defina SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS no .env).'
    );
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }

  return transporter;
}
