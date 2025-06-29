import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import AppInfo from './app-info';

export const metadata: Metadata = {
    title: 'App Details - Radice',
    description: 'View detailed information about this app.',
};

export default function AppInfoPage({ params }: { params: { app_id: string } }) {
    return (
        <div>
            <Navbar />
            <AppInfo params={params} />
            <Footer />
        </div>
    );
}
