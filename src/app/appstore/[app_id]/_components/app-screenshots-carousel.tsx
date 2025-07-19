"use client";

import { useState, useEffect, useRef } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";
import Overlay from "@/components/Overlay";
import { IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type AppScreenshot = {
    id: number;
    imageUrl: string;
    sortOrder: number;
};

type AppScreenshotsCarouselProps = {
    screenshots: AppScreenshot[];
    appName: string;
};

function getImageUrl(imagePath: string | null | undefined): string {
    const PLACEHOLDER = "/placeholders/placeholder.png";
    
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


export default function AppScreenshotsCarousel({
    screenshots,
    appName,
}: AppScreenshotsCarouselProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [fade, setFade] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const fullscreenRef = useRef<HTMLDivElement>(null);

useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showFullscreen) {
                if (e.key === "Escape") closeFullscreen();
                if (e.key === "ArrowLeft") prevImage();
                if (e.key === "ArrowRight") nextImage();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [showFullscreen]);

    useEffect(() => {
        let startX: number | null = null;
        let endX: number | null = null;
        const handleTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
        };
        const handleTouchMove = (e: TouchEvent) => {
            endX = e.touches[0].clientX;
        };
        const handleTouchEnd = () => {
            if (startX !== null && endX !== null) {
                const diff = startX - endX;
                if (diff > 50) nextImage();
                if (diff < -50) prevImage();
            }
            startX = null;
            endX = null;
        };
        const node = showFullscreen ? fullscreenRef.current : carouselRef.current;
        if (node) {
            node.addEventListener("touchstart", handleTouchStart);
            node.addEventListener("touchmove", handleTouchMove);
            node.addEventListener("touchend", handleTouchEnd);
        }
        return () => {
            if (node) {
                node.removeEventListener("touchstart", handleTouchStart);
                node.removeEventListener("touchmove", handleTouchMove);
                node.removeEventListener("touchend", handleTouchEnd);
            }
        };
    }, [showFullscreen, currentImage]);


    useEffect(() => {
        if (showFullscreen && fullscreenRef.current) {
            fullscreenRef.current.focus();
        }
    }, [showFullscreen]);


    useEffect(() => {
        setFade(true);
        const timeout = setTimeout(() => setFade(false), 300);
        return () => clearTimeout(timeout);
    }, [currentImage]);

    const PLACEHOLDER = "/placeholders/placeholder.png";
    if (!screenshots || screenshots.length === 0) {
        return (
            <div className="mb-8">
                <div className="bg-gray-100 w-full h-64 rounded-lg flex items-center justify-center text-gray-500">
                    <img src={PLACEHOLDER} alt="No screenshots available" className="w-32 h-32 object-contain opacity-60" />
                    No screenshots available
                </div>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % screenshots.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    };

    const openFullscreen = (index: number) => {
        setCurrentImage(index);
        setShowFullscreen(true);
    };

    const closeFullscreen = () => {
        setShowFullscreen(false);
    };

    const arrowBtnBase =
        "absolute top-1/2 -translate-y-1/2 hover:bg-black/10 text-white p-2 md:p-3 transition-all duration-200 focus:outline-none focus:scale-110 hover:scale-110 z-10 bg-transparent";

    return (
        <>
            <div className="mb-8" ref={carouselRef} tabIndex={0} aria-label="App screenshots carousel">
                <div className="mb-4">
                    <div className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 flex items-center justify-center">
                        <ImageWithFallback
                            src={getImageUrl(screenshots[currentImage]?.imageUrl)}
                            alt={`${appName} screenshot ${currentImage + 1}`}
                            width="0"
                            height="0"
                            sizes="100vw"
                            className={`w-full h-full object-contain cursor-pointer transition-transform duration-200 ${fade ? "opacity-0" : "opacity-100"}`}
                            onClick={() => openFullscreen(currentImage)}
                            tabIndex={0}
                            aria-label={`Screenshot ${currentImage + 1}`}
                            onKeyDown={e => {
                                if (e.key === "ArrowLeft") prevImage();
                                if (e.key === "ArrowRight") nextImage();
                            }}
                        />
                        {screenshots.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className={`${arrowBtnBase} left-4`}
                                    aria-label="Previous screenshot"
                                    tabIndex={0}
                                >
                                    <IconChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className={`${arrowBtnBase} right-4`}
                                    aria-label="Next screenshot"
                                    tabIndex={0}
                                >
                                    <IconChevronRight size={32} />
                                </button>
                            </>
                        )}
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImage + 1} / {screenshots.length}
                        </div>
                    </div>
                    {screenshots.length > 1 && (
                        <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                            {screenshots.map((screenshot, index) => (
                                <button
                                    key={screenshot.id}
                                    onClick={() => setCurrentImage(index)}
                                    aria-label={`Go to screenshot ${index + 1}`}
                                    className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                        index === currentImage
                                            ? "border-blue-600 scale-110 shadow-lg ring-2 ring-blue-400"
                                            : "border-gray-200 hover:border-gray-400"
                                    }`}
                                >
                                    <ImageWithFallback
                                        src={getImageUrl(screenshot.imageUrl)}
                                        alt={`${appName} screenshot ${index + 1}`}
                                        width="0"
                                        height="0"
                                        sizes="80px"
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {showFullscreen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" ref={fullscreenRef} tabIndex={-1} aria-modal="true" role="dialog">
                    <Overlay onClose={closeFullscreen}>
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <div className="relative max-w-4xl max-h-full">
                                <button
                                    onClick={closeFullscreen}
                                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
                                    aria-label="Close fullscreen view"
                                >
                                    <IconX size={32} />
                                </button>
                                <div className="relative flex items-center justify-center">
                                    <img
                                        src={getImageUrl(screenshots[currentImage]?.imageUrl)}
                                        alt={`${appName} screenshot ${currentImage + 1}`}
                                        className="max-w-full max-h-[80vh] object-contain transition-transform duration-300"
                                        tabIndex={0}
                                        aria-label={`Screenshot ${currentImage + 1}`}
                                        onKeyDown={e => {
                                            if (e.key === "ArrowLeft") prevImage();
                                            if (e.key === "ArrowRight") nextImage();
                                        }}
                                        onError={e => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
                                    />
                                    {screenshots.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className={`${arrowBtnBase} left-4`}
                                                aria-label="Previous screenshot"
                                                tabIndex={0}
                                            >
                                                <IconChevronLeft size={36} />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className={`${arrowBtnBase} right-4`}
                                                aria-label="Next screenshot"
                                                tabIndex={0}
                                            >
                                                <IconChevronRight size={36} />
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                                    {currentImage + 1} of {screenshots.length}
                                </div>
                            </div>
                        </div>
                    </Overlay>
                </div>
            )}
        </>
    );
} 