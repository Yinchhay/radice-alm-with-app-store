"use client";
import {
    IconDownload,
    IconExternalLink,
    IconDeviceLaptop,
    IconDeviceMobile,
    IconBrandApple,
    IconCheck,
    IconX,
} from "@tabler/icons-react";

type AppVersion = {
    versionNumber: string;
    majorVersion: number;
    minorVersion: number;
    patchVersion: number;
};

type AppMetadataProps = {
    appName: string;
    appType: string;
    webUrl?: string;
    appFile?: string;
    versions?: AppVersion[];
    updatedAt?: string;
};

export default function AppMetadata({
    appName,
    appType,
    webUrl,
    appFile,
    versions,
    updatedAt,
}: AppMetadataProps) {
    const currentVersion = versions?.[0];
    const lastUpdated = updatedAt
        ? new Date(updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        : "Unknown";

    const handleDownload = () => {
        if (appFile) {
            window.open(appFile, "_blank");
        } else if (webUrl) {
            window.open(webUrl, "_blank");
        }
    };

    const getActionButton = () => {
        if (appFile) {
            return (
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                    <IconDownload size={20} />
                    Download APK
                </button>
            );
        } else if (webUrl) {
            return (
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                    <IconExternalLink size={20} />
                    Launch App
                </button>
            );
        } else {
            return (
                <button
                    disabled
                    className="flex items-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                    <IconDownload size={20} />
                    Not Available
                </button>
            );
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">App Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-3">
                        Version Details
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Current Version:
                            </span>
                            <span className="font-medium">
                                {currentVersion?.versionNumber || "Unknown"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="font-medium">{lastUpdated}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">App Type:</span>
                            <span className="font-medium capitalize">
                                {appType}
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">
                        Compatibility
                    </h3>
                    <div className="space-y-2">
                        {/* Web */}
                        <div className="flex items-center gap-2">
                            <IconDeviceLaptop size={20} />
                            <span>Web</span>
                            {webUrl ? (
                                <IconCheck size={18} className="text-green-600" />
                            ) : (
                                <IconX size={18} className="text-red-600" />
                            )}
                        </div>
                        {/* Android */}
                        <div className="flex items-center gap-2">
                            <IconDeviceMobile size={20} />
                            <span>Android</span>
                            {appFile ? (
                                <IconCheck size={18} className="text-green-600" />
                            ) : (
                                <IconX size={18} className="text-red-600" />
                            )}
                        </div>
                        {/* iOS (always unsupported for now) */}
                        <div className="flex items-center gap-2">
                            <IconBrandApple size={20} />
                            <span>iOS</span>
                            <IconX size={18} className="text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-1">
                            Get {appName}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {appFile
                                ? "Download the APK file to install on your device"
                                : webUrl
                                ? "Launch the web application in your browser"
                                : "This app is not currently available for download"}
                        </p>
                    </div>
                    {getActionButton()}
                </div>
            </div>
        </div>
    );
}
