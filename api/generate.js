import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { html } = req.body;
  if (!html) {
    return res.status(400).send('Missing HTML content');
  }

  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=document.pdf');
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).send('PDF generation failed');
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}
