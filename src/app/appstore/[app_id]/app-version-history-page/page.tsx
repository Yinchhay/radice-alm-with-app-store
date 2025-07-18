import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import AppVersionHistory from './app-version';

export const metadata: Metadata = {
    title: 'Version History - Radice',
    description: 'View the version history and changelog of this app.',
};

export default function AppVersionHistoryPage({ params }: { params: { app_id: string } }) {
    return (
        <div>
            <Navbar variant="tester"/>
            <AppVersionHistory params={params} />
            <Footer />
        </div>
    );
}
