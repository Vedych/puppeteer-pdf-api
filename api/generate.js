import puppeteer from 'puppeteer-core'; // если используешь chrome-aws-lambda
// import puppeteer from 'puppeteer'; // если не используешь

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests are allowed');
  }

  try {
    const { html } = req.body;
    if (!html) {
      return res.status(400).send('No HTML provided.');
    }

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=document.pdf');
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).send('PDF generation failed');
  }
}




