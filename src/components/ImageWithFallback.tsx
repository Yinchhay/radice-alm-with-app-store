"use client";
import React, { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends ImageProps {
    src: string;
    fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = (props) => {
    const {
        src,
        fallbackSrc = "/placeholders/placeholder.webp",
        ...rest
    } = props;
    const [imgSrc, setImgSrc] = useState<string>(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    return (
        <Image
            {...rest}
            src={imgSrc}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
};

export default ImageWithFallback;
