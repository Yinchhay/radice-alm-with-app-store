import React from "react";

type AppBannerProps = {
    bannerImage: string;
    title: string;
    subtitle?: string;
};

const AppBanner: React.FC<AppBannerProps> = ({
    bannerImage,
    title,
    subtitle,
}) => {
    return (
        <div className="relative w-full- max-w-screen-2xl h-[600px] mx-auto rounded-xl overflow-hidden border bg-white">
            <img
                src={bannerImage}
                alt={`${title}`}
                className="object-cover w-full h-full"
            />
        </div>
    );
};

export default AppBanner;
