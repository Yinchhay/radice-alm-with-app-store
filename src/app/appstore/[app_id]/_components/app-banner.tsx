import React from "react";

type AppBannerProps = {
    bannerImage: string;
    title: string;
    subtitle?: string;
};

const AppBanner: React.FC<AppBannerProps> = ({
    bannerImage,
    title,
}) => {
    return (
        <div className="relative w-full max-w-screen-2xl h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] mx-auto rounded-lg overflow-hidden border bg-white">
            <img
                src={bannerImage}
                alt={`${title}`}
                className="object-cover w-full h-full"
            />
        </div>
    );
};

export default AppBanner;
