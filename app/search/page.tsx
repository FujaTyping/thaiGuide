import { useTranslations } from 'next-intl';
import TGtitle from '../components/tgtitle';
import SSearch from './search';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ThaiGuide – Search"
}

function Page() {
    const t = useTranslations('Search');

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('title')} badge={t('beta')} decs={t('decs')} />
                <SSearch />
            </main>
        </>
    )
}

export default Page