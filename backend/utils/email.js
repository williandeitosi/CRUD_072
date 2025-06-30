export async function sendWelcomeEmail(email, token) {
  console.log(`MENSAGEM MOCK:
  Para: ${email}
  Assunto: Confirmação de conta
  Link: http://localhost:3000/users/confirm?token=${token}
  `);
}
