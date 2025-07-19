import React, { useState } from "react";

type AppBannerProps = {
    bannerImage: string;
    title: string;
    subtitle?: string;
};

const PLACEHOLDER = "/placeholders/placeholder.png";

function getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
        return PLACEHOLDER;
    }
    
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    if (imagePath.startsWith('/uploads/')) {
        const filename = imagePath.replace('/uploads/', '');
        return `/api/file?filename=${filename}`;
    }
    
    return `/api/file?filename=${imagePath}`;
}


const AppBanner: React.FC<AppBannerProps> = ({
    bannerImage,
    title,
}) => {
    const [imgSrc, setImgSrc] = useState(getImageUrl(bannerImage));
    return (
        <div className="relative w-full max-w-screen-2xl h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] mx-auto rounded-lg overflow-hidden border bg-white">
            <img
                src={imgSrc || PLACEHOLDER}
                alt={`${title}`}
                className="object-cover w-full h-full"
                onError={() => setImgSrc(PLACEHOLDER)}
            />
        </div>
    );
};

export default AppBanner;
