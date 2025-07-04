import nodemailer from "nodemailer";

export async function sendWelcomeEmail(email, token) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const confirmationUrl = `http://localhost:3000/users/confirm?token=${token}`;

    await transporter.sendMail({
      from: `"Event App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Confirme sua conta",
      html: `
        <h2>Bem-vindo!</h2>
        <p>Clique no link abaixo para confirmar seu cadastro:</p>
        <a href="${confirmationUrl}">Confirmar conta</a>
      `,
    });

    console.log(`E-mail de confirmação enviado para ${email}`);
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
  }
}
