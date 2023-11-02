"use client";
import { Roboto_Condensed, Roboto } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";

const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});
const roboto = Roboto({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function Carousel() {
    function changeSlide(amount: number) {
        if (currentSlide + amount == slides.length) {
            setCurrentSlide(0);
        } else if (currentSlide + amount < 0) {
            setCurrentSlide(slides.length - 1);
        } else setCurrentSlide(currentSlide + amount);
    }

    const slides = [
        {
            name: "EdTech",
            image: "edtech.jpg",
        },
        {
            name: "FinTech",
            image: "fintech.jpg",
        },
        {
            name: "HealthTech",
            image: "healthtech.jpg",
        },
        // {
        //     name: "ServiceTech",
        //     image: "servicetech.jpg",
        // },
    ];
    const [currentSlide, setCurrentSlide] = useState(0);
    return (
        <div>
            <div className="container grid grid-cols-5 m-auto pt-24 gap-16">
                <div className="relative col-span-3">
                    <div className="absolute w-full h-[400px] flex items-center justify-between z-20">
                        <button
                            className="ml-4 text-white -scale-100 hover:-scale-75 transition-all p-4"
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
                            className="ml-4 text-white hover:scale-75 transition-all p-4"
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
                        {slides.map((tech, i) => {
                            return (
                                <CarouselCard
                                    active={currentSlide == i}
                                    image={tech.image}
                                    key={i}
                                    index={i}
                                    currentSlide={currentSlide}
                                    maxSlides={slides.length}
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
                        {slides[currentSlide].name}
                    </h2>
                </div>
                <div className="col-span-2 relative">
                    <div className="overflow-hidden">
                        <h2
                            className={[
                                "uppercase text-white text-8xl font-bold leading-[0.90] translate-y-[100%] animate-reveal",
                                roboto_condensed.className,
                            ].join(" ")}
                        >
                            Research & Development
                        </h2>
                    </div>
                    <p
                        className={["text-white mt-4", roboto.className].join(
                            " "
                        )}
                    >
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry&apos;s standard dummy text ever since the
                        1500s, when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.
                    </p>
                    <div className="relative mt-12">
                        <button className="py-2 px-12 bg-white text-black text-2xl font-bold">
                            VIEW
                        </button>
                        <div className="select-none absolute top-1 left-1 py-2 px-12 bg-transparent border-white border text-transparent text-2xl font-bold">
                            VIEW
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CarouselCard({
    active,
    image,
    index,
    currentSlide,
    maxSlides,
}: {
    active: Boolean;
    image: string;
    index: number;
    currentSlide: number;
    maxSlides: number;
}) {
    return (
        <li
            className={[
                "absolute top-[50%] left-[50%] w-[687px] transition-all",
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
                <Image
                    width={100}
                    height={100}
                    layout="responsive"
                    objectFit="cover"
                    src={"/" + image}
                    alt=""
                />
            </div>
        </li>
    );
}
