import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { resumeData } = await req.json();

    const html = buildHtmlFromResumeData(resumeData);

    let browser;
    if (process.env.NODE_ENV === 'production') {
      const chromium = await import('@sparticuz/chromium');
      const puppeteer = await import('puppeteer-core');
      browser = await puppeteer.default.launch({
        args: chromium.default.args,
        executablePath: await chromium.default.executablePath(),
        headless: true,
      });
    } else {
      const puppeteer = await import('puppeteer-core');
      browser = await puppeteer.default.launch({
        headless: true,
        executablePath:
          process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_EXECUTABLE_PATH,
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    const pdfArrayBuffer = new ArrayBuffer(pdfBuffer.length);
    new Uint8Array(pdfArrayBuffer).set(pdfBuffer);

    await browser.close();

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

function buildHtmlFromResumeData(resumeData: any): string {
  const header = resumeData.sections.find((section: any) => section.type === 'header')?.data;
  const summary = resumeData.sections.find((section: any) => section.type === 'summary')?.data;
  const experience = resumeData.sections.find((section: any) => section.type === 'experience')?.data;
  const education = resumeData.sections.find((section: any) => section.type === 'education')?.data;
  const skills = resumeData.sections.find((section: any) => section.type === 'skills')?.data;
  const projects = resumeData.sections.find((section: any) => section.type === 'projects')?.data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, serif; font-size: 10.5pt; color: #1a1a1a; line-height: 1.45; }
  .page { width: 794px; padding: 48px 54px; }
  h1 { font-size: 26pt; font-weight: 700; text-align: center; }
  .role { text-align: center; font-size: 11pt; text-transform: uppercase; letter-spacing: 2px; color: #444; margin: 4px 0 8px; }
  .contact { text-align: center; font-size: 9.5pt; color: #333; margin-bottom: 14px; }
  .divider { border: none; border-top: 2px solid #1a1a1a; margin-bottom: 16px; }
  .section { margin-bottom: 16px; }
  .section-title { font-size: 10.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #1a1a1a; padding-bottom: 3px; margin-bottom: 10px; }
  .entry { margin-bottom: 12px; }
  .entry-header { display: flex; justify-content: space-between; }
  .job-title { font-weight: 700; font-size: 10.5pt; }
  .company { font-size: 10pt; color: #444; font-weight: 600; margin-bottom: 4px; }
  .dates { font-size: 9.5pt; color: #555; }
  ul { padding-left: 17px; list-style: disc; }
  li { font-size: 10pt; margin-bottom: 3px; line-height: 1.45; }
  .skill-row { font-size: 10pt; margin-bottom: 4px; }
  .skill-label { font-weight: 700; }
  .project-name { font-weight: 700; font-size: 10.5pt; }
  .project-desc { font-size: 10pt; margin-top: 2px; line-height: 1.55; }
</style>
</head>
<body>
<div class="page">
  ${header ? `
  <h1>${header.name}</h1>
  <div class="role">${header.jobTitle}</div>
  <div class="contact">${[header.contact.email, header.contact.phone, header.contact.location, header.contact.linkedin, header.contact.github].filter(Boolean).join(' | ')}</div>
  <hr class="divider"/>
  ` : ''}

  ${summary ? `
  <div class="section">
    <div class="section-title">Summary</div>
    <p style="font-size:10pt;line-height:1.6;">${summary.content}</p>
  </div>` : ''}

  ${experience?.entries?.length ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${experience.entries.map((entry: any) => `
      <div class="entry">
        <div class="entry-header">
          <span class="job-title">${entry.jobTitle}</span>
          <span class="dates">${entry.startDate} - ${entry.endDate}</span>
        </div>
        <div class="company">${entry.company}${entry.location ? ` — ${entry.location}` : ''}</div>
        <ul>${entry.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}</ul>
      </div>
    `).join('')}
  </div>` : ''}

  ${education?.entries?.length ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${education.entries.map((entry: any) => `
      <div class="entry">
        <div class="entry-header">
          <span class="job-title">${entry.degree}</span>
          <span class="dates">${entry.graduationDate}</span>
        </div>
        <div class="company">${entry.institution}</div>
      </div>
    `).join('')}
  </div>` : ''}

  ${skills ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skill-row"><span class="skill-label">Technical Skills: </span>${skills.data.technical.join(', ')}</div>
    <div class="skill-row"><span class="skill-label">Interpersonal: </span>${skills.data.interpersonal.join(', ')}</div>
  </div>` : ''}

  ${projects?.entries?.length ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projects.entries.map((entry: any) => `
      <div class="entry">
        <div class="project-name">${entry.name}</div>
        <div class="project-desc">${entry.description}</div>
      </div>
    `).join('')}
  </div>` : ''}
</div>
</body>
</html>`;
}
