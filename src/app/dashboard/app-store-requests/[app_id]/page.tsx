import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import AppRequestClientWrapper from './_components/client-wrapper';

export default function AppRequestPage({ params }: { params: { app_id: string } }) {
  return (
    <div className="container mx-auto py-6 pl-9">
      <div className="mb-6">
        <Link 
          href={`/dashboard/app-store-requests`} 
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to App Store Requests
        </Link>
        
        <h1 className="text-2xl pl-6 font-bold mt-4">App Store Request Details</h1>
      </div>
      
      <AppRequestClientWrapper appId={params.app_id} />
    </div>
  );
} 