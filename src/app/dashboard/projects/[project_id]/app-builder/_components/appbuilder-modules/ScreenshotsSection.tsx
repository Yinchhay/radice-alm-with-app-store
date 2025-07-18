import React from "react";

export default function ScreenshotsSection({
    screenshots,
    setScreenshots,
    MAX_SCREENSHOTS,
    makeScreenshotObj,
    dedupeByKey,
    renderUploadList,
    FileDropzone,
    errors,
    appData,
    deleteScreenshotOnServer,
}: any) {
    return (
        <>
            <h3 className="text-[20px] font-semibold mt-6 mb-2">Screenshots (Max {MAX_SCREENSHOTS}) <span className="text-red-500">*</span></h3>
            <p className="text-sm font-medium">Screenshot <span className="text-red-500">*</span></p>
            <FileDropzone
                label="Screenshot images"
                accept="image/*"
                multiple
                onChange={(files: FileList) => {
                    setScreenshots((prev: any[]) => {
                        const newFiles = Array.from(files).map(makeScreenshotObj);
                        let combined = [...prev, ...newFiles];
                        if (combined.length > MAX_SCREENSHOTS) {
                            combined = combined.slice(0, MAX_SCREENSHOTS);
                        }
                        return dedupeByKey(combined);
                    });
                }}
                disabled={screenshots.length >= MAX_SCREENSHOTS}
            />
            <div style={{ minHeight: 60 * screenshots.length + 20 }}>
                {screenshots.map((img: any, idx: number) => {
                    let previewUrl = "";
                    let filename = "";
                    if (img.file instanceof File) {
                        previewUrl = URL.createObjectURL(img.file);
                        filename = img.file.name;
                    } else if (img.url) {
                        previewUrl = img.url;
                        filename = img.url.split("/").pop() || img.url;
                    }
                    return (
                        <div key={img.key || filename + idx} style={{ background: "#eee", margin: "8px 0", padding: 8, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                                {previewUrl && (
                                    <img src={previewUrl} alt="preview" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4, background: "#fff", border: "1px solid #ccc" }} />
                                )}
                                <div style={{ flex: 1 }}>
                                    <span>{filename}</span>
                                    {typeof img.progress === "number" && (
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                                            <div className="bg-gray-200 h-1.5 rounded mt-1" style={{ flex: 1, minWidth: 0 }}>
                                                <div className="h-1.5 bg-black rounded transition-all duration-200" style={{ width: `${img.progress}%` }} />
                                            </div>
                                            <span style={{ minWidth: 36, textAlign: "right", fontSize: 12, color: "#333" }}>
                                                {img.progress < 100 ? `${img.progress}%` : "Uploaded"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                className="ml-2 text-gray-500 hover:text-red-500 text-sm"
                                onClick={async () => {
                                    if (img.id && appData?.appId) {
                                        await deleteScreenshotOnServer(appData.appId, img.id);
                                    }
                                    setScreenshots((prev: any[]) => prev.filter((_: any, i: number) => i !== idx));
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}
            </div>
            {errors.screenshots && (
                <div className="text-xs text-red-500">{errors.screenshots}</div>
            )}
        </>
    );
} 