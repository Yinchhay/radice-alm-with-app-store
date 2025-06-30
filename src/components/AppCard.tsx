import { App } from "@/app/appstore/appstore";
import Link from "next/link";

const typeColors: Record<number, { name: string; color: string }> = {
    1: { name: "Web", color: "#4285F4" },
    2: { name: "Mobile", color: "#FF5500" },
    3: { name: "API", color: "#34A853" }
}

export function AppCard({app, clickable = true} : { app: App; clickable?: boolean}){
    const CardContent = () => (
        <div className="bg-transparent overflow-hidden flex flex-col p-4 w-full">
            <div className="w-full aspect-[16/9] mb-4">
                {app.app.cardImage ? (
                    <img src={app.app.cardImage} alt={app.project.name || "App"} className="w-full h-full object-cover rounded-lg"/>
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                        <span className="text-gray-400">No Image</span>
                    </div>
                )}
            </div>
            <div className="flex flex-col">
                <div className="font-bold text-sm mb-1" style={{color: "#7F56D9"}}>{app.category?.name|| "Unknown"}</div>
                <div className="font-bold text-lg mb-1">{app.project.name || "Untitled"}</div>
                <div className="text-sm text-gray-600 mb-2">{app.app.subtitle}</div>
                <div className="flex items-center justify-between">
                    <span
                        className={`text-xs px-2 py-1 rounded-full text-white`}
                        style={{ 
                            backgroundColor: app.app.type && typeColors[app.app.type] 
                                ? typeColors[app.app.type].color 
                                : "#6B7280" 
                        }}
                    >
                        {app.app.type && typeColors[app.app.type] 
                            ? typeColors[app.app.type].name 
                            : "Unknown"
                        }
                    </span>
                </div>
            </div>
        </div>
    );
    if (clickable) {
        return (
            <Link 
                href={`/appstore/${app.app.id}`}
                className="block cursor-pointer hover:bg-gray-50 transition-colors rounded-xl"
            >
                <CardContent />
            </Link>
        )
    }
    return <CardContent />;
}