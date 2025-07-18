import type { App } from "@/types/app_types";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

const typeColors: Record<number, { name: string; color: string }> = {
    1: { name: "Web", color: "#4285F4" },
    2: { name: "Mobile", color: "#FF5500" },
    3: { name: "API", color: "#34A853" }
}

export function AppCard({ app, clickable = true }: { app: App; clickable?: boolean }) {
    const [imageError, setImageError] = useState(false);

    const CardContent = () => (
        <div className="w-full overflow-hidden bg-white flex flex-col">
            <div className="w-full aspect-[16/9] border-2 border-gray-100 overflow-hidden rounded-lg relative">
                {!imageError && app.cardImage ? (
                    <Image
                        src={app.cardImage.startsWith("/") ? app.cardImage : `/placeholders/placeholder.png`}
                        alt={app.project?.name || "App"}
                        className="w-full h-full object-cover"
                        fill
                        style={{ objectFit: 'cover' }}
                        onError={() => setImageError(true)}
                        priority={false}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-between p-4 flex-1">
                <div>
                    <div className="font-bold text-sm mb-1" style={{color: "#7F56D9"}}>{app.category?.name|| "Unknown"}</div>
                    <div className="font-bold text-lg mb-1 line-clamp-1">{app.project?.name || "Untitled"}</div>
                    <div className="text-sm text-gray-600 mb-2 line-clamp-2">{app.subtitle}</div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span
                        className={`text-xs px-2 py-1 rounded-full text-white`}
                        style={{ 
                            backgroundColor: app.type && typeColors[Number(app.type)] 
                                ? typeColors[Number(app.type)].color 
                                : "#6B7280" 
                        }}
                    >
                        {app.type && typeColors[Number(app.type)] 
                            ? typeColors[Number(app.type)].name 
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
                href={`/appstore/${app.id}`}
                className="block cursor-pointer hover:bg-gray-50 transition-colors rounded-xl"
            >
                <CardContent />
            </Link>
        )
    }
    return <CardContent />;
}
