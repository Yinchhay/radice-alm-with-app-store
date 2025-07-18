import React from "react";

export default function BannerAndCardSection({
    cardImages,
    setCardImages,
    bannerImages,
    setBannerImages,
    errors,
    renderUploadList,
    FileDropzone,
    setCardImageProgress,
    setBannerImageProgress,
    appId,
}: any) {
    const previewImageStyle: React.CSSProperties = {
        width: 48,
        height: 48,
        objectFit: "cover",
        borderRadius: 4,
        background: "#fff",
        border: "1px solid #ccc",
    };
    // Helper to wrap files in the correct object structure
    const wrapFiles = (files: FileList) => Array.from(files).map(file => ({ file, progress: 0, key: `${file.name}_${file.lastModified}_${crypto.randomUUID()}` }));
    return (
        <>
            <h3 className="text-[20px] font-semibold mt-6 mb-2">Image <span className="text-red-500">*</span></h3>
            <p className="text-sm font-medium">Card <span className="text-red-500">*</span></p>
            <FileDropzone
                label="Card image only"
                accept="image/*"
                onChange={(files: FileList) => setCardImages(wrapFiles(files))}
                multiple={false}
                disabled={cardImages.length > 0}
            />
            {cardImages.map((img: any, idx: number) => {
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
                                <img src={previewUrl} alt="preview" style={previewImageStyle} />
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
                            onClick={() => setCardImages((prev: any[]) => prev.filter((_, i: number) => i !== idx))}
                        >
                            ✕
                        </button>
                    </div>
                );
            })}
            {errors.cardImages && (
                <div className="text-xs text-red-500">{errors.cardImages}</div>
            )}
            <p className="text-sm font-medium">Banner <span className="text-red-500">*</span></p>
            <FileDropzone
                label="Banner image only"
                accept="image/*"
                onChange={(files: FileList) => setBannerImages(wrapFiles(files))}
                multiple={false}
                disabled={bannerImages.length > 0}
            />
            {bannerImages.map((img: any, idx: number) => {
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
                                <img src={previewUrl} alt="preview" style={previewImageStyle} />
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
                            onClick={() => setBannerImages((prev: any[]) => prev.filter((_, i: number) => i !== idx))}
                        >
                            ✕
                        </button>
                    </div>
                );
            })}
            {errors.bannerImages && (
                <div className="text-xs text-red-500">{errors.bannerImages}</div>
            )}
        </>
    );
} 