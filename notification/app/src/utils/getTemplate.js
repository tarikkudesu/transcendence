import fs from 'fs/promises';


const templates = {
    OTP: '../../public/verify.html',
    OTT: '../../public/reset-password.html',
}

export default async function getTemplate (reason, content)
{
    const filePath = new URL (templates[reason], import.meta.url);
    const html = await fs.readFile(filePath, 'utf8');
    return html.replace (reason, content);
};
