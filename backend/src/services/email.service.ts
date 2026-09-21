import nodemailer, { type Transporter } from "nodemailer";

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// Si el usuario configuró usuario y contraseña en el .env, enviamos correos reales
const isSmtpConfigured = Boolean(smtpUser && smtpPass);

let transporter: Transporter | null = null;
if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

// ----------------------------------------------------------------------
// 1. ENVIAR CORREO DE VERIFICACIÓN DE CUENTA
// ----------------------------------------------------------------------
export async function sendVerificationEmail(email: string, fullName: string, token: string) {
  const verificationUrl = `${frontendUrl}/verificar-correo/${token}`;

  // Si no hay SMTP configurado, usamos el MODO SIMULADOR en la terminal
  if (!isSmtpConfigured || !transporter) {
    console.log("\n" + "=".repeat(65));
    console.log("📧 [SIMULADOR DE CORREO - VERIFICACIÓN DE CUENTA]");
    console.log(`Para: ${fullName} <${email}>`);
    console.log("Asunto: Verifica tu cuenta en MotoRent");
    console.log("Haz clic en el siguiente enlace para verificar tu correo:");
    console.log(`👉 ${verificationUrl}`);
    console.log("=".repeat(65) + "\n");
    return;
  }

  // Correo real con diseño HTML
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0F2537; color: #FFFFFF; border-radius: 16px; overflow: hidden; padding: 40px 30px;">
      <h1 style="color: #FF6A3D; font-size: 26px; margin-bottom: 10px;">¡Bienvenido a MotoRent, ${fullName}! 🏍️</h1>
      <p style="font-size: 15px; color: #CBD5E0; line-height: 1.6;">
        Gracias por registrarte. Para poder alquilar motos o publicar la tuya, necesitamos confirmar que este correo te pertenece.
      </p>
      <div style="text-align: center; margin: 35px 0;">
        <a href="${verificationUrl}" style="background-color: #FF6A3D; color: #FFFFFF; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block;">
          Verificar mi Correo Electrónico
        </a>
      </div>
      <p style="font-size: 12px; color: #718096; line-height: 1.5;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
        <a href="${verificationUrl}" style="color: #FF6A3D;">${verificationUrl}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #1A3E5C; margin: 30px 0;" />
      <p style="font-size: 12px; color: #718096; text-align: center;">
        Este enlace expirará en 24 horas. Si no creaste una cuenta en MotoRent, puedes ignorar este mensaje.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"MotoRent" <${smtpUser}>`,
    to: email,
    subject: "Verifica tu cuenta en MotoRent 🏍️",
    html: htmlContent,
  });
}

// ----------------------------------------------------------------------
// 2. ENVIAR CORREO DE RECUPERACIÓN DE CONTRASEÑA
// ----------------------------------------------------------------------
export async function sendPasswordResetEmail(email: string, fullName: string, token: string) {
  const resetUrl = `${frontendUrl}/reset-password/${token}`;

  // Si no hay SMTP configurado, usamos el MODO SIMULADOR en la terminal
  if (!isSmtpConfigured || !transporter) {
    console.log("\n" + "=".repeat(65));
    console.log("🔑 [SIMULADOR DE CORREO - RECUPERACIÓN DE CONTRASEÑA]");
    console.log(`Para: ${fullName} <${email}>`);
    console.log("Asunto: Restablece tu contraseña de MotoRent");
    console.log("Haz clic en el siguiente enlace para crear una nueva clave (expira en 1 hora):");
    console.log(`👉 ${resetUrl}`);
    console.log("=".repeat(65) + "\n");
    return;
  }

  // Correo real con diseño HTML
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0F2537; color: #FFFFFF; border-radius: 16px; overflow: hidden; padding: 40px 30px;">
      <h1 style="color: #FF6A3D; font-size: 26px; margin-bottom: 10px;">Recuperación de Contraseña 🔑</h1>
      <p style="font-size: 15px; color: #CBD5E0; line-height: 1.6;">
        Hola, ${fullName}. Recibimos una solicitud para restablecer la contraseña de tu cuenta en MotoRent.
      </p>
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetUrl}" style="background-color: #FF6A3D; color: #FFFFFF; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block;">
          Restablecer mi Contraseña
        </a>
      </div>
      <p style="font-size: 12px; color: #718096; line-height: 1.5;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
        <a href="${resetUrl}" style="color: #FF6A3D;">${resetUrl}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #1A3E5C; margin: 30px 0;" />
      <p style="font-size: 12px; color: #718096; text-align: center;">
        Por seguridad, este enlace vencerá en 1 hora. Si tú no solicitaste este cambio, no te preocupes, tu cuenta está a salvo y puedes ignorar este correo.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"MotoRent Soporte" <${smtpUser}>`,
    to: email,
    subject: "Restablece tu contraseña - MotoRent 🔑",
    html: htmlContent,
  });
}