import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

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
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

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
  switch (resumeData?.templateId) {
    case 'sharp':
      return buildSharpHtml(resumeData);
    case 'executive':
      return buildExecutiveHtml(resumeData);
    case 'minimal-line':
      return buildMinimalLineHtml(resumeData);
    case 'sidebar-pro':
      return buildSidebarProHtml(resumeData);
    case 'classic':
    default:
      return buildClassicHtml(resumeData);
  }
}

function buildClassicHtml(resumeData: any): string {
  const sections = getVisibleSections(resumeData);
  const header = getHeaderData(sections);
  const bodySections = sections.filter((section: any) => section.type !== 'header');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    ${sharedPageCss()}
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Georgia, serif; font-size: 10.5pt; color: #1a1a1a; line-height: 1.45; }
    .page { width: 794px; padding: 48px 54px; }
    .name { font-size: 26pt; font-weight: 700; text-align: center; }
    .role { text-align: center; font-size: 11pt; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #4b5563; margin-top: 4px; }
    .contact { text-align: center; font-size: 9.5pt; color: #333; margin-top: 8px; margin-bottom: 14px; }
    .divider { border: none; border-top: 2px solid #1a1a1a; margin: 0 0 16px 0; }
    .section { margin-bottom: 16px; }
    .section-title { font-size: 10.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #1a1a1a; padding-bottom: 3px; margin-bottom: 10px; }
    .entry { margin-bottom: 12px; }
    .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .job-title { font-weight: 700; font-size: 10.5pt; color: #111827; }
    .company { font-size: 10pt; color: #4b5563; font-weight: 600; margin-bottom: 4px; }
    .dates { font-size: 9.5pt; color: #555; white-space: nowrap; }
    .bullets { margin: 0; padding-left: 17px; }
    .bullet { font-size: 10pt; margin-bottom: 3px; line-height: 1.45; }
    .summary { font-size: 10pt; color: #374151; line-height: 1.6; }
    .skill-row { font-size: 10pt; margin-bottom: 4px; }
    .skill-label { font-weight: 700; }
    .project-name { font-weight: 700; font-size: 10.5pt; }
    .project-desc { font-size: 10pt; margin-top: 2px; line-height: 1.55; color: #374151; }
    .project-link { font-size: 9pt; margin-top: 2px; color: #2563eb; }
  </style>
</head>
<body>
  <div class="page">
    ${header ? classicHeaderHtml(header) : ''}
    ${renderCommonSections(bodySections)}
  </div>
</body>
</html>`;
}

function buildSharpHtml(resumeData: any): string {
  const sections = getVisibleSections(resumeData);
  const header = getHeaderData(sections);
  const bodySections = sections.filter((section: any) => section.type !== 'header');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    ${sharedPageCss()}
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, Arial, sans-serif; font-size: 10.5pt; color: #1a1a1a; line-height: 1.45; }
    .page { width: 794px; padding: 48px 54px; }
    .header { border-left: 3px solid #1e40af; padding-left: 12px; margin-bottom: 20px; }
    .name { font-size: 32pt; line-height: 1.1; font-weight: 800; color: #0f172a; }
    .role { font-size: 11pt; font-weight: 600; color: #1e40af; margin-top: 4px; }
    .contact { font-size: 9pt; color: #6b7280; margin-top: 8px; }
    .section { margin-bottom: 16px; }
    .section-title { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #1e40af; background: #dbeafe; padding: 2px 8px; border-radius: 2px; display: inline-block; margin-bottom: 10px; }
    .entry { margin-bottom: 12px; }
    .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .job-title { font-weight: 700; font-size: 10.5pt; color: #0f172a; }
    .company { font-size: 10pt; color: #1e40af; font-weight: 500; margin-bottom: 4px; }
    .dates { font-size: 9pt; color: #64748b; white-space: nowrap; }
    .bullets { margin: 0; padding-left: 17px; }
    .bullet { font-size: 9.5pt; margin-bottom: 3px; line-height: 1.45; color: #374151; }
    .summary { font-size: 9.8pt; color: #374151; line-height: 1.6; }
    .skill-row { font-size: 9.8pt; margin-bottom: 4px; color: #374151; }
    .skill-label { font-weight: 700; color: #0f172a; }
    .project-name { font-weight: 700; font-size: 10.5pt; color: #0f172a; }
    .project-desc { font-size: 9.5pt; margin-top: 2px; line-height: 1.55; color: #374151; }
    .project-link { font-size: 9pt; margin-top: 2px; color: #1e40af; }
  </style>
</head>
<body>
  <div class="page">
    ${header ? sharpHeaderHtml(header) : ''}
    ${renderCommonSections(bodySections)}
  </div>
</body>
</html>`;
}

function buildExecutiveHtml(resumeData: any): string {
  const sections = getVisibleSections(resumeData);
  const header = getHeaderData(sections);
  const bodySections = sections.filter((section: any) => section.type !== 'header');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap');
    ${sharedPageCss()}
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Lora, Georgia, serif; font-size: 10.5pt; color: #1a1a1a; line-height: 1.6; }
    .page { width: 794px; padding: 48px 54px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #0f4c3a; padding-bottom: 14px; margin-bottom: 18px; }
    .name { font-size: 24pt; font-weight: 700; color: #0f4c3a; }
    .role { font-size: 10.5pt; font-weight: 700; color: #0f4c3a; margin-top: 4px; }
    .contact { font-size: 9pt; color: #555; text-align: right; line-height: 1.8; }
    .section { margin-bottom: 18px; }
    .section-title { border-left: 3px solid #0f4c3a; padding-left: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #0f4c3a; margin-bottom: 8px; font-size: 9.5pt; }
    .entry { margin-bottom: 13px; }
    .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .job-title { font-weight: 700; font-size: 10.5pt; color: #0f4c3a; }
    .company { font-size: 10pt; color: #6b7280; font-style: italic; margin-bottom: 4px; }
    .dates { font-size: 9.3pt; color: #64748b; white-space: nowrap; }
    .bullets { margin: 0; padding-left: 17px; }
    .bullet { font-size: 9.8pt; margin-bottom: 3px; line-height: 1.55; color: #374151; }
    .summary { font-size: 10pt; color: #374151; line-height: 1.65; }
    .skill-row { font-size: 10pt; margin-bottom: 4px; }
    .skill-label { font-weight: 700; color: #0f4c3a; }
    .project-name { font-weight: 700; font-size: 10.5pt; color: #0f4c3a; }
    .project-desc { font-size: 9.8pt; margin-top: 2px; line-height: 1.6; color: #374151; }
    .project-link { font-size: 9pt; margin-top: 2px; color: #0f4c3a; }
  </style>
</head>
<body>
  <div class="page">
    ${header ? executiveHeaderHtml(header) : ''}
    ${renderCommonSections(bodySections)}
  </div>
</body>
</html>`;
}

function buildMinimalLineHtml(resumeData: any): string {
  const sections = getVisibleSections(resumeData);
  const header = getHeaderData(sections);
  const bodySections = sections.filter((section: any) => section.type !== 'header');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
    ${sharedPageCss()}
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 10.5pt; color: #111; line-height: 1.55; }
    .page { width: 794px; padding: 48px 54px; }
    .header { text-align: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 0.5px solid #e5e7eb; }
    .name { font-size: 22pt; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; color: #111; }
    .role { font-size: 10pt; color: #888; font-weight: 400; letter-spacing: 1px; margin-top: 6px; }
    .contact { font-size: 9pt; color: #888; margin-top: 8px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 8pt; font-weight: 400; text-transform: uppercase; letter-spacing: 3px; color: #888; border-bottom: 0.5px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 12px; }
    .entry { margin-bottom: 14px; }
    .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .job-title { font-weight: 600; font-size: 10.5pt; color: #111; }
    .company { font-size: 10pt; color: #555; font-weight: 400; margin-bottom: 4px; }
    .dates { font-size: 9pt; color: #999; white-space: nowrap; }
    .bullets { margin: 0; padding-left: 17px; }
    .bullet { font-size: 9.5pt; margin-bottom: 3px; line-height: 1.6; color: #444; }
    .summary { font-size: 9.8pt; color: #444; line-height: 1.6; }
    .skill-row { font-size: 9.8pt; margin-bottom: 4px; color: #444; }
    .skill-label { font-weight: 500; color: #666; }
    .project-name { font-weight: 600; font-size: 10.5pt; color: #111; }
    .project-desc { font-size: 9.5pt; margin-top: 2px; line-height: 1.6; color: #444; }
    .project-link { font-size: 9pt; margin-top: 2px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="page">
    ${header ? minimalHeaderHtml(header) : ''}
    ${renderCommonSections(bodySections)}
  </div>
</body>
</html>`;
}

function buildSidebarProHtml(resumeData: any): string {
  const sections = getVisibleSections(resumeData);
  const header = getHeaderData(sections);
  const skillsData =
    sections.find((section: any) => section.type === 'skills')?.data?.data ?? null;
  const mainSections = sections.filter(
    (section: any) => section.type !== 'header' && section.type !== 'skills'
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
    ${sharedPageCss()}
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 10pt; color: #1a1a1a; line-height: 1.5; }
    .page { width: 794px; min-height: 1123px; display: flex; }
    .sidebar { width: 200px; background: #1e293b; color: #cbd5e1; padding: 28px 18px; }
    .main { flex: 1; padding: 28px; }
    .name { font-size: 16pt; font-weight: 700; color: #fff; line-height: 1.2; }
    .role { font-size: 9pt; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
    .sidebar-title { font-size: 7pt; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #64748b; border-bottom: 0.5px solid #334155; padding-bottom: 4px; margin-bottom: 8px; }
    .contact-item { display: flex; gap: 6px; align-items: flex-start; margin-bottom: 5px; font-size: 8.5pt; color: #cbd5e1; line-height: 2; }
    .contact-icon { width: 16px; flex-shrink: 0; opacity: 0.85; }
    .sidebar-label { font-size: 7.5pt; color: #64748b; margin-bottom: 4px; font-weight: 600; }
    .sidebar-skill { font-size: 8.5pt; color: #cbd5e1; margin-bottom: 3px; padding-left: 6px; border-left: 2px solid #334155; }
    .section { margin-bottom: 16px; }
    .section-title { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1e293b; border-bottom: 1px solid #1e293b; padding-bottom: 3px; margin-bottom: 10px; }
    .entry { margin-bottom: 12px; }
    .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .job-title { font-weight: 700; font-size: 10.2pt; color: #1e293b; }
    .company { font-size: 10pt; color: #475569; font-weight: 500; margin-bottom: 4px; }
    .dates { font-size: 9pt; color: #64748b; white-space: nowrap; }
    .bullets { margin: 0; padding-left: 17px; }
    .bullet { font-size: 10pt; margin-bottom: 3px; line-height: 1.5; color: #1a1a1a; }
    .summary { font-size: 10pt; color: #1a1a1a; line-height: 1.6; }
    .skill-row { font-size: 10pt; margin-bottom: 4px; color: #1a1a1a; }
    .skill-label { font-weight: 700; color: #1e293b; }
    .project-name { font-weight: 700; font-size: 10.2pt; color: #1e293b; }
    .project-desc { font-size: 10pt; margin-top: 2px; line-height: 1.55; color: #1a1a1a; }
    .project-link { font-size: 9pt; margin-top: 2px; color: #2563eb; }
  </style>
</head>
<body>
  <div class="page">
    <aside class="sidebar">
      ${header ? sidebarHeaderHtml(header) : ''}
      ${header ? sidebarContactHtml(header.contact) : ''}
      ${skillsData ? sidebarSkillsHtml(skillsData) : ''}
    </aside>
    <main class="main">
      ${renderCommonSections(mainSections)}
    </main>
  </div>
</body>
</html>`;
}

function sharedPageCss() {
  return `
    @page {
      size: A4;
      margin: 48px 54px;
    }

    .section {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .entry {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .page-break-before {
      page-break-before: always;
      break-before: always;
    }
  `;
}

function getVisibleSections(resumeData: any) {
  return [...(resumeData?.sections ?? [])]
    .filter((section: any) => section?.visible !== false)
    .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));
}

function getHeaderData(sections: any[]) {
  const headerSection = sections.find((section: any) => section.type === 'header');
  return headerSection?.data?.type === 'header' ? headerSection.data : null;
}

function asHtml(value: any): string {
  return typeof value === 'string' ? value : '';
}

function sectionLabel(type: string): string {
  switch (type) {
    case 'summary':
      return 'Summary';
    case 'experience':
      return 'Work Experience';
    case 'education':
      return 'Education';
    case 'skills':
      return 'Skills';
    case 'projects':
      return 'Projects';
    case 'certifications':
      return 'Certifications';
    case 'languages':
      return 'Languages';
    case 'custom':
      return 'Custom';
    default:
      return '';
  }
}

function renderCommonSections(sections: any[]) {
  return sections
    .map((section: any) => {
      const data = section?.data;
      if (!data) return '';

      switch (section.type) {
        case 'summary':
          return `
            <section class="section">
              <div class="section-title">${sectionLabel('summary')}</div>
              <div class="summary">${asHtml(data.content)}</div>
            </section>
          `;

        case 'experience':
          return `
            <section class="section">
              <div class="section-title">${sectionLabel('experience')}</div>
              ${(data.entries ?? [])
                .map(
                  (entry: any) => `
                  <div class="entry">
                    <div class="entry-header">
                      <div class="job-title">${asHtml(entry.jobTitle)}</div>
                      <div class="dates">${asHtml(entry.startDate)} - ${asHtml(entry.endDate)}</div>
                    </div>
                    <div class="company">${asHtml(entry.company)}${asHtml(entry.location) ? ` - ${asHtml(entry.location)}` : ''}</div>
                    <ul class="bullets">
                      ${(entry.bullets ?? [])
                        .map((bullet: any) => `<li class="bullet">${asHtml(bullet)}</li>`)
                        .join('')}
                    </ul>
                  </div>
                `
                )
                .join('')}
            </section>
          `;

        case 'education':
          return `
            <section class="section">
              <div class="section-title">${sectionLabel('education')}</div>
              ${(data.entries ?? [])
                .map(
                  (entry: any) => `
                  <div class="entry">
                    <div class="entry-header">
                      <div class="job-title">${asHtml(entry.degree)}</div>
                      <div class="dates">${asHtml(entry.graduationDate)}</div>
                    </div>
                    <div class="company">${asHtml(entry.institution)}${asHtml(entry.location) ? ` - ${asHtml(entry.location)}` : ''}</div>
                  </div>
                `
                )
                .join('')}
            </section>
          `;

        case 'skills':
          return `
            <section class="section">
              <div class="section-title">${sectionLabel('skills')}</div>
              <div class="skill-row"><span class="skill-label">Technical Skills: </span>${(data.data?.technical ?? []).map((skill: any) => asHtml(skill)).join(', ')}</div>
              <div class="skill-row"><span class="skill-label">Interpersonal: </span>${(data.data?.interpersonal ?? []).map((skill: any) => asHtml(skill)).join(', ')}</div>
            </section>
          `;

        case 'projects':
          return `
            <section class="section">
              <div class="section-title">${sectionLabel('projects')}</div>
              ${(data.entries ?? [])
                .map(
                  (entry: any) => `
                  <div class="entry">
                    <div class="project-name">${asHtml(entry.name)}</div>
                    <div class="project-desc">${asHtml(entry.description)}</div>
                    ${asHtml(entry.link) ? `<div class="project-link">${asHtml(entry.link)}</div>` : ''}
                  </div>
                `
                )
                .join('')}
            </section>
          `;

        case 'certifications':
          return `
            <section class="section">
              <div class="section-title">${sectionLabel('certifications')}</div>
              ${(data.entries ?? [])
                .map(
                  (entry: any) => `
                  <div class="entry">
                    <div class="entry-header">
                      <div class="job-title">${asHtml(entry.name)}</div>
                      <div class="dates">${asHtml(entry.date)}</div>
                    </div>
                    <div class="company">${asHtml(entry.issuer)}</div>
                  </div>
                `
                )
                .join('')}
            </section>
          `;

        case 'languages':
          return `
            <section class="section">
              <div class="section-title">${sectionLabel('languages')}</div>
              ${(data.items ?? [])
                .map(
                  (item: any) =>
                    `<div class="skill-row"><span class="skill-label">${asHtml(item.language)}:</span> ${asHtml(item.level)}</div>`
                )
                .join('')}
            </section>
          `;

        case 'custom':
          return `
            <section class="section">
              <div class="section-title">${asHtml(data.title) || 'Custom Section'}</div>
              <div class="summary">${asHtml(data.content)}</div>
            </section>
          `;

        default:
          return '';
      }
    })
    .join('');
}

function classicHeaderHtml(header: any) {
  const contact = [
    asHtml(header.contact?.email),
    asHtml(header.contact?.phone),
    asHtml(header.contact?.location),
    asHtml(header.contact?.linkedin),
    asHtml(header.contact?.github),
  ]
    .filter(Boolean)
    .join(' | ');

  return `
    <div class="name">${asHtml(header.name)}</div>
    <div class="role">${asHtml(header.jobTitle)}</div>
    <div class="contact">${contact}</div>
    <hr class="divider" />
  `;
}

function sharpHeaderHtml(header: any) {
  const contact = [
    asHtml(header.contact?.email),
    asHtml(header.contact?.phone),
    asHtml(header.contact?.location),
    asHtml(header.contact?.linkedin),
    asHtml(header.contact?.github),
  ]
    .filter(Boolean)
    .join(' | ');

  return `
    <div class="header">
      <div class="name">${asHtml(header.name)}</div>
      <div class="role">${asHtml(header.jobTitle)}</div>
      <div class="contact">${contact}</div>
    </div>
  `;
}

function executiveHeaderHtml(header: any) {
  const contactLines = [
    asHtml(header.contact?.email),
    asHtml(header.contact?.phone),
    asHtml(header.contact?.location),
    asHtml(header.contact?.linkedin),
    asHtml(header.contact?.github),
  ].filter(Boolean);

  return `
    <div class="header">
      <div>
        <div class="name">${asHtml(header.name)}</div>
        <div class="role">${asHtml(header.jobTitle)}</div>
      </div>
      <div class="contact">${contactLines.join('<br/>')}</div>
    </div>
  `;
}

function minimalHeaderHtml(header: any) {
  const contact = [
    asHtml(header.contact?.email),
    asHtml(header.contact?.phone),
    asHtml(header.contact?.location),
    asHtml(header.contact?.linkedin),
    asHtml(header.contact?.github),
  ]
    .filter(Boolean)
    .join(' &middot; ');

  return `
    <div class="header">
      <div class="name">${asHtml(header.name)}</div>
      <div class="role">${asHtml(header.jobTitle)}</div>
      <div class="contact">${contact}</div>
    </div>
  `;
}

function sidebarHeaderHtml(header: any) {
  return `
    <div style="margin-bottom:24px;">
      <div class="name">${asHtml(header.name)}</div>
      <div class="role">${asHtml(header.jobTitle)}</div>
    </div>
  `;
}

function sidebarContactHtml(contact: any) {
  const items = [
    { icon: '@', value: asHtml(contact?.email) },
    { icon: 'T', value: asHtml(contact?.phone) },
    { icon: 'L', value: asHtml(contact?.location) },
    { icon: 'in', value: asHtml(contact?.linkedin) },
    { icon: 'gh', value: asHtml(contact?.github) },
  ].filter((item) => item.value);

  return `
    <div style="margin-bottom:20px;">
      <div class="sidebar-title">Contact</div>
      ${items
        .map(
          (item) =>
            `<div class="contact-item"><span class="contact-icon">${item.icon}</span><span>${item.value}</span></div>`
        )
        .join('')}
    </div>
  `;
}

function sidebarSkillsHtml(skillsData: any) {
  return `
    <div>
      <div class="sidebar-title">Skills</div>
      <div style="margin-bottom:8px;">
        <div class="sidebar-label">Technical</div>
        ${(skillsData.technical ?? [])
          .map((skill: any) => `<div class="sidebar-skill">${asHtml(skill)}</div>`)
          .join('')}
      </div>
      <div>
        <div class="sidebar-label" style="margin-top:8px;">Interpersonal</div>
        ${(skillsData.interpersonal ?? [])
          .map((skill: any) => `<div class="sidebar-skill">${asHtml(skill)}</div>`)
          .join('')}
      </div>
    </div>
  `;
}
