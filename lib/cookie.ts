import { cookies } from 'next/headers';

const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en';

export default locale;