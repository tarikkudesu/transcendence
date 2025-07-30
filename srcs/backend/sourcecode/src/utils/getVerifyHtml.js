import fs from 'fs/promises';



const filePath = new URL ('../../public/verify.html', import.meta.url);

export default async function getVerifyHtml (code)
{
    const html = await fs.readFile(filePath, 'utf8');
    return html.replace ('123456', code);
};