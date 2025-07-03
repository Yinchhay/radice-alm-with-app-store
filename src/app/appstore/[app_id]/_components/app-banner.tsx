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
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg mb-8">
            <img
                src={bannerImage}
                alt={`${title} banner`}
                className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center">
                <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-2 text-lg md:text-2xl text-gray-200 drop-shadow">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AppBanner;
