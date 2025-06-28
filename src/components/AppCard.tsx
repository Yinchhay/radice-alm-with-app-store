import { App } from "@/app/appstore/appstore";

const typeColors: Record<number, { name: string; color: string }> = {
    1: { name: "Web", color: "#4285F4" },
    2: { name: "Mobile", color: "#FF5500" },
    3: { name: "API", color: "#34A853" }
}

export function AppCard({app, clickable = true} : { app: App; clickable?: boolean}){
    const handleClick = () => {
        if (clickable) {
            window.location.href = `/app/${app.app.id}`;
        }
    };

    
    return (
        <div onClick={handleClick} className={`bg-transparent overflow-hidden flex flex-col p-4 ${clickable ? 'cursor-pointer hover:bg-transparent' : ''}`}>
            {app.app.cardImage ? (
                <img src={app.app.cardImage} alt={app.project.name || "App"} className="w-full h-48 object-cover rounded-lg mb-4"/>
            ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg mb-4">
                    <span className="text-gray-400">No Image</span>
                </div>
            )}
            <div className="flex flex-col">
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
    )
}