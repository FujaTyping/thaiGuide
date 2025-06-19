import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    // Attempt to get locale from cookie, default to 'en' if not found
    const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en';

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});