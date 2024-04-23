"use client";

import Button from "@/components/Button";
import Image from "next/image";
import { useRef, useState } from "react";

export default function UploadImage() {
    const imageRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string | null>(null);

    const handleUpload = async () => {
        if (!imageRef.current || !imageRef.current.files) {
            return;
        }

        const image = imageRef.current.files[0];

        if (!image) {
            return;
        }

        const formData = new FormData();
        formData.append("file", image);

        const response = await fetch("/api/file/store", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            console.log(await response.json());
            setImage(image.name);
        } else {
            console.error("Failed to upload image");
        }
    };

    return (
        <div>
            <input type="file" ref={imageRef} />
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
