import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.setContent('<h1>Hello from Puppeteer PDF API</h1>');
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=document.pdf');
  res.send(pdf);
}
