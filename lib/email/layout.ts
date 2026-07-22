// Shared, email-safe branded layout for all outbound mail. Uses table-based
// markup + inline styles (the only thing email clients render reliably) and
// reproduces the site wordmark in HTML so no hosted image asset is required.

export const BRAND = {
  name: 'Old Colony Chauffeur',
  website: 'https://oldcolonychauffeur.com',
  websiteLabel: 'oldcolonychauffeur.com',
  email: 'info@oldcolonychauffeur.com',
  phone: '(781) 234-5451',
  phoneHref: 'tel:+17812345451',
} as const;

const C = {
  magenta: '#B08D57',
  dark: '#12263A',
  gray: '#6F6A5E',
  light: '#F6F2EA',
  border: '#E6DDCA',
  muted: '#9CA3AF',
} as const;

/** Escape user-supplied values before interpolating into email HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface EmailRow {
  label: string;
  value: string;
}

/** A two-column label/value table for trip + contact details. */
export function detailTable(rows: EmailRow[]): string {
  const body = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${C.border};font-size:13px;color:${C.gray};width:38%;vertical-align:top">${escapeHtml(r.label)}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${C.border};font-size:14px;color:${C.dark};font-weight:500;vertical-align:top">${escapeHtml(r.value)}</td>
      </tr>`,
    )
    .join('');
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin-top:16px">${body}</table>`;
}

interface WrapEmailOptions {
  heading: string;
  intro?: string;
  /** Pre-built inner HTML (e.g. a detailTable). Not escaped — caller controls it. */
  contentHtml?: string;
  /** Hidden preview text shown in the inbox list. */
  preheader?: string;
}

/** Wrap inner content in the branded header/footer shell. */
export function wrapEmail({ heading, intro, contentHtml, preheader }: WrapEmailOptions): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light only">
</head>
<body style="margin:0;padding:0;background-color:${C.light};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheader)}</div>` : ''}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${C.light}">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background-color:#ffffff;border:1px solid ${C.border};border-radius:16px">
          <!-- Header / wordmark -->
          <tr>
            <td style="padding:28px 32px 0 32px">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:${C.dark};border-radius:10px;width:40px;height:40px;text-align:center;vertical-align:middle;color:#C9A876;font-size:20px;line-height:40px">&#10022;</td>
                  <td style="padding-left:12px;vertical-align:middle;font-family:Georgia,'Times New Roman',serif">
                    <div style="font-size:17px;font-weight:600;letter-spacing:3px;color:${C.dark}">OLD COLONY</div>
                    <div style="font-size:9px;font-weight:600;letter-spacing:4px;color:${C.magenta};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">CHAUFFEUR</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:24px 32px 8px 32px">
              <h1 style="margin:0 0 8px 0;font-size:22px;line-height:1.25;color:${C.dark};font-family:Georgia,'Times New Roman',serif">${escapeHtml(heading)}</h1>
              ${intro ? `<p style="margin:0;font-size:14px;line-height:1.6;color:${C.gray}">${escapeHtml(intro)}</p>` : ''}
              ${contentHtml ?? ''}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 28px 32px">
              <div style="border-top:1px solid ${C.border};padding-top:20px">
                <p style="margin:0 0 4px 0;font-size:13px;color:${C.gray}">
                  <a href="${BRAND.phoneHref}" style="color:${C.magenta};text-decoration:none;font-weight:600">${BRAND.phone}</a>
                  &nbsp;·&nbsp;
                  <a href="mailto:${BRAND.email}" style="color:${C.magenta};text-decoration:none">${BRAND.email}</a>
                </p>
                <p style="margin:0;font-size:13px;color:${C.gray}">
                  <a href="${BRAND.website}" style="color:${C.gray};text-decoration:none">${BRAND.websiteLabel}</a>
                </p>
                <p style="margin:14px 0 0 0;font-size:11px;line-height:1.5;color:${C.muted}">© ${new Date().getFullYear()} ${BRAND.name}. Private car service to Boston Logan Airport.</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
