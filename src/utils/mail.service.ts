import nodemailer from 'nodemailer';

export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(to: string[], subject: string, text: string, html?: string) {
    const mailOptions = {
      from: `"MultiLang" <${process.env.EMAIL_USER}>`,
      bcc: to.join(','), 
      subject,
      text,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email: %s', error);
      throw error;
    }
  }
}
