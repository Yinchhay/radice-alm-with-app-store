"use client";

import Button from "@/components/Button";
import { getSessionCookie } from "@/lib/server_utils";
import Image from "next/image";
import { useRef, useState } from "react";

export default function UploadImage() {
    const imageRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string | null>(null);
    const handleUpload = async () => {
        if (!imageRef.current || !imageRef.current.files) {
            return;
        }

        const files = imageRef.current.files;
        if (!files) {
            return;
        }

        const formData = new FormData();
        for (const file of files) {
            formData.append("files", file);
        }

        const sessionId = await getSessionCookie();
        const response = await fetch("/api/file/store", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${sessionId}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setImage(data.data.filenames[0]);
        } else {
            console.error("Failed to upload image");
        }
    };

    return (
        <div>
            <input type="file" ref={imageRef} multiple/>
            <Button onClick={handleUpload}>Upload</Button>
            {image && (
                <>
                    <h1>This is the image that u upload and store</h1>
                    <Image
                        src={`/api/file?filename=${image}`}
                        alt="image"
                        width={200}
                        height={200}
                    />
                </>
            )}
        </div>
    );
}
