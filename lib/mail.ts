import { createTransport } from "nodemailer";

const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

function makeANiceEmail(text:string){
    return `
    <div style="
        border:1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
    ">
        <h2>Hello, there</h2>
        <h2>${text}</h2>
        <p>${text}</p>
    </div>
    `   
}

interface MailResponse {
    message: string;

}

export async function sendPasswordResetEmail(resetToken:string, to:string): Promise<void>{

    const info: MailResponse = (await transporter.sendMail({
        to,
        from:'wesbos@wesbos.com',
        subject: 'Your password reset token!',
        html: makeANiceEmail(`Your password Reset Token is here
        <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset</a>
        `
        
        )
    })) as MailResponse
}