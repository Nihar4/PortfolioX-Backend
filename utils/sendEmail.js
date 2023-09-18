import { createTransport } from "nodemailer";

export const sendEmail = async (to, subject, text) => {
    const transporter = createTransport({
        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        // auth: {
        //     user: process.env.SMTP_USER,
        //     pass: process.env.SMTP_PASS,
        // },
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "stockportfoliox@gmail.com",
            pass: "mtjjyzpfeippifdp",
        },
    });
    await transporter.sendMail({
        to,
        subject,
        text,
    });
};
