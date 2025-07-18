import React from "react";

interface AppUploadSectionProps {
    appFiles: any[];
    setAppFiles: (files: any[]) => void;
    renderUploadList: (uploads: any[], setter: Function) => React.ReactNode;
    FileDropzone: React.FC<any>;
    errors: any;
}

const AppUploadSection: React.FC<AppUploadSectionProps> = ({
    appFiles,
    setAppFiles,
    renderUploadList,
    FileDropzone,
    errors,
}) => {
    return (
        <section className="mb-8">
            <h2 className="text-lg font-semibold mb-2">App File</h2>
            <p className="text-gray-500 text-sm mb-2">
                Upload your app file (e.g., APK, IPA, ZIP, etc.). Only one file allowed.
            </p>
            <FileDropzone
                label="App file (.apk, .ipa, .zip, etc.)"
                accept=".apk,.ipa,.zip,.exe,.dmg,.app,.tar,.gz,.rar,.7z"
                multiple={false}
                onChange={(files: FileList) => setAppFiles(Array.from(files))}
                disabled={appFiles.length > 0}
            />
            {errors.appFiles && (
                <div className="text-red-500 text-xs mt-1">{errors.appFiles}</div>
            )}
            <div className="mt-3">
                {appFiles.map((file: any, idx: number) => {
                    let previewName = "";
                    if (file.file instanceof File) {
                        previewName = file.file.name;
                    } else if (file.url) {
                        previewName = file.url.split("/").pop() || file.url;
                    }
                    return (
                        <div key={file.key || previewName + idx} style={{ background: "#eee", margin: "8px 0", padding: 8, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ flex: 1 }}>
                                <span>{previewName}</span>
                                {typeof file.progress === "number" && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                                        <div className="bg-gray-200 h-1.5 rounded mt-1" style={{ flex: 1, minWidth: 0 }}>
                                            <div className="h-1.5 bg-black rounded transition-all duration-200" style={{ width: `${file.progress}%` }} />
                                        </div>
                                        <span style={{ minWidth: 36, textAlign: "right", fontSize: 12, color: "#333" }}>
                                            {file.progress < 100 ? `${file.progress}%` : "Uploaded"}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button
                                className="ml-2 text-gray-500 hover:text-red-500 text-sm"
                                onClick={() => setAppFiles(appFiles.filter((_, i: number) => i !== idx))}
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default AppUploadSection; 