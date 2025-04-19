import chromium from 'chrome-aws-lambda';

export default async function handler(req, res) {
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent('<h1>Hello from Puppeteer PDF API</h1>');
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=document.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error); // <--- добавь это
    if (browser) await browser.close();
    res.status(500).send('PDF generation failed');
  }
}


