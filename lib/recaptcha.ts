const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY ?? '';

interface SiteVerifyResponse {
  success: boolean;
  score?: number;
  'error-codes'?: string[];
}

/* Verifies a reCAPTCHA v2 token against Google's siteverify endpoint.
   Returns false on any failure (network, missing token, missing secret),
   so callers can fail closed. */
export async function verifyRecaptcha(token: string | undefined | null): Promise<boolean> {
  if (!RECAPTCHA_SECRET_KEY) return false;
  if (!token) return false;

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: RECAPTCHA_SECRET_KEY, response: token }),
    });
    const data = (await res.json()) as SiteVerifyResponse;
    return data.success === true;
  } catch {
    return false;
  }
}
