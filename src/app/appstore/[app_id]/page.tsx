import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import AppPage from './app-info';

export const metadata: Metadata = {
    title: 'App Details - Radice',
    description: 'View detailed information about this app.',
};

export default function AppInfoPage({ params }: { params: { app_id: string } }) {
    return (
        <div>
            <Navbar />
            <AppPage params={params} />
            <Footer />
        </div>
    );
}
