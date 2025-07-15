// app/dashboard/projects/[project_id]/app-builder/page.tsx
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import AppBuilderClientWrapper from './_components/client-wrapper';
import DashboardPageTitle from '@/components/DashboardPageTitle';

export default function AppBuilderPage({ params }: { params: { project_id: string } }) {
  return (
    <div className="container mx-auto py-6 pl-9">
      <div className="mb-6">
        <Link 
          href={`/dashboard/projects/`} 
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>
        
        <div className="pl-6 mt-4">
          <DashboardPageTitle title="App Builder" />
        </div>
      </div>
      
      <AppBuilderClientWrapper projectId={params.project_id} />
    </div>
  );
}
