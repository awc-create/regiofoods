// The admin runs on admin.regiofoods.in, where "/" opens the dashboard.
// Links to the public website therefore need the public domain.
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

export function publicUrl(path = '/') {
  return `${SITE}${path.startsWith('/') ? path : `/${path}`}`;
}
