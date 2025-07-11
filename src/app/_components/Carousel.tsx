"use client";
import { Roboto_Condensed, Roboto } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import TechButton from "../../components/TechButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";
import SpecialEffectSentence from "@/components/effects/SpecialEffectSentence";
import { CategoryAndProjects } from "@/repositories/project";

const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function Carousel({
    categories,
}: {
    categories: CategoryAndProjects[];
}) {
    const [currentSlide, setCurrentSlide] = useState(0);

    function changeSlide(amount: number) {
        if (currentSlide + amount == categories.length) {
            setCurrentSlide(0);
        } else if (currentSlide + amount < 0) {
            setCurrentSlide(categories.length - 1);
        } else setCurrentSlide(currentSlide + amount);
    }

    return (
        <div>
            {categories.length > 0 && (
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 pt-12 lg:pt-24 gap-6 lg:gap-10">
                    <div className="relative lg:col-span-3 order-1 lg:order-1">
                        <div className="absolute w-full h-[220px] sm:h-[260px] lg:h-[340px] flex items-center justify-between z-20">
                            <button
                                className="ml-2 lg:ml-4 text-white -scale-100 hover:-scale-75 duration-200 p-2 lg:p-4"
                                onClick={() => changeSlide(-1)}
                            >
                                <Image
                                    src={"/ui/arrow.svg"}
                                    width={20}
                                    height={36}
                                    className="lg:w-6 lg:h-[46px]"
                                    alt=""
                                />
                            </button>
                            <button
                                className="mr-2 lg:mr-4 text-white hover:scale-75 duration-200 p-2 lg:p-4"
                                onClick={() => changeSlide(1)}
                            >
                                <Image
                                    src={"/ui/arrow.svg"}
                                    width={20}
                                    height={36}
                                    className="lg:w-6 lg:h-[46px]"
                                    alt=""
                                />
                            </button>
                        </div>
                        <ul className="relative h-[220px] sm:h-[260px] lg:h-[340px]">
                            {categories.map((category, i) => {
                                return (
                                    <CarouselCard
                                        active={currentSlide == i}
                                        src={fileToUrl(category.logo)}
                                        key={`carousel-card-${i}`}
                                        index={i}
                                        currentSlide={currentSlide}
                                        maxSlides={categories.length}
                                    />
                                );
                            })}
                        </ul>
                        <h2
                            className={[
                                "text-white text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-[0.90] translate-y-[100%] animate-reveal text-center mt-4 lg:mt-8",
                                roboto_condensed.className,
                            ].join(" ")}
                        >
                            {categories.length > 0
                                ? categories[currentSlide].name
                                : ""}
                        </h2>
                    </div>
                    <div className="lg:col-span-2 relative order-2 lg:order-2">
                        <div className="overflow-hidden">
                            <h2
                                className={[
                                    "w-full lg:w-[580px] uppercase text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[0.90] translate-y-[100%] animate-reveal",
                                    roboto_condensed.className,
                                ].join(" ")}
                            >
                                Research & Development
                            </h2>
                        </div>
                        <p className="text-white mt-3 lg:mt-4 text-sm sm:text-base">
                            <SpecialEffectSentence
                                delay={50}
                                shuffleSpeed={20}
                                randomAmount={8}
                                originalText={
                                    categories[currentSlide].description ||
                                    "This category does not have a description."
                                }
                            />
                        </p>
                        <TechButton
                            link={`#${categories[currentSlide].name}`}
                            variant="light"
                            className="mt-6 lg:mt-12"
                            text="VIEW"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function CarouselCard({
    active,
    src,
    index,
    currentSlide,
    maxSlides,
}: {
    active: Boolean;
    src: string;
    index: number;
    currentSlide: number;
    maxSlides: number;
}) {
    return (
        <li
            className={[
                "absolute top-[50%] left-[50%] w-[260px] sm:w-[340px] lg:w-[580px] duration-200",
                active ? "translate-x-[-50%] translate-y-[-50%] z-10" : "",
                index == 0 && currentSlide == maxSlides - 1
                    ? "translate-x-[-20%] translate-y-[-50%] scale-75 brightness-[.4]"
                    : "",
                index == maxSlides - 1 && currentSlide == 0
                    ? "translate-x-[-80%] translate-y-[-50%] scale-75 brightness-[.4]"
                    : "",
                index > currentSlide &&
                !(index == maxSlides - 1 && currentSlide == 0)
                    ? "translate-x-[-20%] translate-y-[-50%] scale-75 brightness-[.4]"
                    : "",
                index < currentSlide &&
                !(index == 0 && currentSlide == maxSlides - 1)
                    ? "translate-x-[-80%] translate-y-[-50%] scale-75 brightness-[.4]"
                    : "",
            ].join(" ")}
        >
            <div
                className={[
                    "absolute w-[260px] h-[143px] sm:w-[340px] sm:h-[187px] lg:w-[580px] lg:h-[319px] top-1 left-1 sm:top-2 sm:left-2 lg:top-3 lg:left-3",
                    active ? "" : "hidden",
                ].join(" ")}
            >
                <Image
                    width={100}
                    height={100}
                    layout="responsive"
                    objectFit="cover"
                    src={"/ui/carousel_card_outline.svg"}
                    alt=""
                />
            </div>
            <div
                className="relative w-[260px] h-[143px] sm:w-[340px] sm:h-[187px] lg:w-[580px] lg:h-[319px]"
                style={{
                    maskImage: "url(/ui/carousel_card.svg)",
                    WebkitMaskImage: "url(/ui/carousel_card.svg)",
                    WebkitMaskSize: "100% 100%",
                    WebkitMaskRepeat: "no-repeat",
                }}
            >
                <ImageWithFallback
                    width={580}
                    height={319}
                    className="object-cover w-full h-full"
                    src={src}
                    alt=""
                />
            </div>
        </li>
    );
}
