import chromium from 'chrome-aws-lambda';
import { Buffer } from 'buffer';

export default async function handler(req, res) {
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent('<h1>Hello from Puppeteer PDF API</h1>');
    const pdfBuffer = await page.pdf({ format: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=document.pdf');
    res.status(200).send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).send('PDF generation failed');
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}



