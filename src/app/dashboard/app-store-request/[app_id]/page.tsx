import InformationView from "./information";

export default function AppStoreRequestInfoPage({ params }: { params: { app_id: string } }) {
  return (
    <div className="w-full max-w-[1000px] mx-auto py-8">
      <InformationView appId={params.app_id} />
    </div>
  );
} 