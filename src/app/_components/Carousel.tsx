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
            <div className="container grid grid-cols-5 m-auto pt-24 gap-10">
                <div className="relative col-span-3">
                    <div className="absolute w-full h-[400px] flex items-center justify-between z-20">
                        <button
                            className="ml-4 text-white -scale-100 hover:-scale-75 duration-200 p-4"
                            onClick={() => changeSlide(-1)}
                        >
                            <Image
                                src={"/arrow.svg"}
                                width={32}
                                height={58}
                                alt=""
                            />
                        </button>
                        <button
                            className="ml-4 text-white hover:scale-75 duration-200 p-4"
                            onClick={() => changeSlide(1)}
                        >
                            <Image
                                src={"/arrow.svg"}
                                width={32}
                                height={58}
                                alt=""
                            />
                        </button>
                    </div>
                    <ul className="relative h-[400px]">
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
                            "text-white text-6xl font-bold leading-[0.90] translate-y-[100%] animate-reveal text-center mt-8",
                            roboto_condensed.className,
                        ].join(" ")}
                    >
                        {categories.length > 0
                            ? categories[currentSlide].name
                            : ""}
                    </h2>
                </div>
                <div className="col-span-2 relative ">
                    <div className="overflow-hidden">
                        <h2
                            className={[
                                "w-[580px] uppercase text-white text-8xl font-bold leading-[0.90] translate-y-[100%] animate-reveal",
                                roboto_condensed.className,
                            ].join(" ")}
                        >
                            Research & Development
                        </h2>
                    </div>
                    <p className="text-white mt-4">
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
                        className="mt-12"
                        text="VIEW"
                        onClick={() => {
                            console.log("click");
                        }}
                    />
                </div>
            </div>
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
                "absolute top-[50%] left-[50%] w-[687px] duration-200",
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
                    "absolute w-[687px] h-[378px] top-3 left-3",
                    active ? "" : "hidden",
                ].join(" ")}
            >
                <Image
                    width={100}
                    height={100}
                    layout="responsive"
                    objectFit="cover"
                    src={"/carousel_card_outline.svg"}
                    alt=""
                />
            </div>
            <div
                className="relative w-[687px] h-[378px]"
                style={{
                    maskImage: "url(/carousel_card.svg)",
                    WebkitMaskImage: "url(/carousel_card.svg)",
                    WebkitMaskSize: "687px 378px",
                    WebkitMaskRepeat: "no-repeat",
                }}
            >
                <ImageWithFallback
                    width={687}
                    height={378}
                    className="object-cover"
                    src={src}
                    alt=""
                />
            </div>
        </li>
    );
}
