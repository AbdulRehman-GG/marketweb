import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text, html }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });


    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
    });
};

export default sendEmail;