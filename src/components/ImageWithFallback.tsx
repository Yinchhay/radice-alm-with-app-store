import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends ImageProps {
    src: string;
    fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = (props) => {
    const { src, fallbackSrc = "/placeholder.webp", ...rest } = props;
    const [imgSrc, setImgSrc] = useState<string>(src);

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
