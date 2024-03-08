"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Eye() {
    const stopDistance = 220;
    const irisMove = 34;
    const irisOffset = 8;
    const pupilMove = 50;
    const pupilOffset = 10;
    const iris = useRef<HTMLImageElement>(null);
    const irisRing = useRef<HTMLImageElement>(null);
    const pupil = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (iris.current && pupil.current && irisRing.current) {
                const containerRect = iris.current.getBoundingClientRect();
                const containerCenterX =
                    containerRect.left + containerRect.width / 2;
                const containerCenterY =
                    containerRect.top + containerRect.height / 2;

                const mouseX = event.clientX;
                const mouseY = event.clientY;

                const distanceX = mouseX - containerCenterX;
                const distanceY = mouseY - containerCenterY;

                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

                let scaleFactor = 1;

                if (distance < stopDistance) {
                    scaleFactor = distance / stopDistance;
                }

                const irisPosX =
                    (distanceX / distance) * irisMove * scaleFactor;
                const irisPosY =
                    (distanceY / distance) * irisMove * scaleFactor;
                const pupilPosX =
                    (distanceX / distance) * pupilMove * scaleFactor;
                const pupilPosY =
                    (distanceY / distance) * pupilMove * scaleFactor;

                iris.current.style.transform = `scale(0.8) translate(${irisPosX}px, ${irisPosY}px)`;
                irisRing.current.style.transform = `scale(0.8) translate(${irisPosX}px, ${irisPosY}px)`;
                pupil.current.style.transform = `scale(0.8) translate(${pupilPosX}px, ${pupilPosY}px)`;
            }
        };

        // Add event listener when component mounts
        document.addEventListener("mousemove", handleMouseMove);

        // Cleanup by removing event listener when component unmounts
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);
    return (
        <div className="relative grid place-items-center select-none pointer-events-none animate-fade">
            <Image
                alt=""
                src={"/layer12.svg"}
                width={580}
                height={580}
                className="absolute opacity-50"
            />
            <Image
                alt=""
                src={"/layer0.svg"}
                width={570}
                height={570}
                className="absolute animate-layer0 opacity-25"
            />
            <Image
                alt=""
                src={"/layer1.svg"}
                width={800}
                height={800}
                className="absolute animate-layer1 opacity-30"
            />
            <Image
                alt=""
                src={"/layer2.svg"}
                width={720}
                height={720}
                className="absolute animate-layer2 opacity-90"
            />
            <Image
                alt=""
                src={"/layer3.svg"}
                width={630}
                height={630}
                className="absolute animate-layer3"
            />
            <Image
                alt=""
                src={"/layer4.svg"}
                width={520}
                height={520}
                className="absolute animate-layer4 opacity-80"
            />
            <Image
                alt=""
                src={"/layer5.svg"}
                width={430}
                height={430}
                className="absolute animate-layer5"
            />
            <Image
                alt=""
                src={"/layer6.svg"}
                width={367}
                height={367}
                className="absolute animate-layer6"
            />
            <Image
                alt=""
                src={"/layer7.svg"}
                width={350}
                height={350}
                className="absolute animate-layer7 opacity-75"
            />
            <Image
                alt=""
                src={"/layer8.svg"}
                width={280}
                height={280}
                className="absolute animate-layer8"
            />
            <Image
                alt=""
                src={"/layer9.svg"}
                width={255}
                height={255}
                className="absolute animate-layer9"
            />
            <Image
                ref={iris}
                alt=""
                src={"/iris.svg"}
                width={110}
                height={110}
                className="absolute opacity-90"
            />
            <div className="absolute w-[170px] h-[170px] animate-layer11">
                <Image
                    ref={irisRing}
                    alt=""
                    src={"/layer10.svg"}
                    width={170}
                    height={170}
                    className="absolute opacity-90"
                />
            </div>
            <Image
                ref={pupil}
                alt=""
                src={"/pupil.svg"}
                width={35}
                height={35}
                className="absolute"
            />
        </div>
    );
}
