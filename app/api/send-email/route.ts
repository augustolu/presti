import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { user_name, user_email, message } = await request.json();

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return NextResponse.json({ error: 'Faltan las credenciales de correo en las variables de entorno.' }, { status: 500 });
        }

        // Configuración del transporte (quién envía el correo)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // Tu correo (PrestiValentino004@gmail.com)
                pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación
            },
            // Optimizaciones para serverless
            pool: false, // Usar conexión directa en lugar de pool para serverless
            connectionTimeout: 5000, // 5 segundos de timeout
            greetingTimeout: 5000,
            socketTimeout: 10000,
        } as any);

        // Configuración del mensaje
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO, // A quién le llega (knightdsbusiness@gmail.com)
            replyTo: user_email, // Para que al responder le respondas al usuario
            subject: `Nuevo mensaje de ${user_name} - Portfolio`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Nuevo mensaje de contacto</h2>
                    <p>Has recibido un nuevo mensaje desde tu portfolio.</p>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
                        <p><strong>Nombre:</strong> ${user_name}</p>
                        <p><strong>Email:</strong> ${user_email}</p>
                        <p><strong>Mensaje:</strong></p>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email enviado con éxito' }, { status: 200 });
    } catch (error) {
        console.error('Error enviando email:', error);
        return NextResponse.json({ error: 'Error al enviar el email' }, { status: 500 });
    }
}