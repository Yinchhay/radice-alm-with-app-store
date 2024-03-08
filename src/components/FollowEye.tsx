"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function FollowEye() {
    const stopDistance = 200;
    const pupilReduceDistance = 20;
    const iris = useRef<HTMLImageElement>(null);
    const pupil = useRef<HTMLImageElement>(null);
    //const [irisPos, setIrisPos] = useState({ x: Number, y: Number });
    const reduceNumberBy = (num: number, reduceBy: number) =>
        num === 0 ? 0 : (num < 0 ? -1 : 1) * (Math.abs(num) - reduceBy);

    const handleMouseOver = (event: React.MouseEvent<HTMLInputElement>) => {
        //console.log("Mouse position:", { x: event.clientX, y: event.clientY });
        if (iris.current && pupil.current) {
            const containerRect = iris.current.getBoundingClientRect();
            const centerX = containerRect.left + containerRect.width / 2;
            const centerY = containerRect.top + containerRect.height / 2;

            let disX = event.clientX - centerX;
            let disY = event.clientY - centerY;
            let angle = Math.atan2(disY, disX) * (180 / Math.PI);
            console.log(`Angle: ${angle}`);

            let distance = Math.sqrt(disX ** 2 + disY ** 2);
            let posX: number = 0,
                posY: number = 0;
            if (distance > stopDistance) {
                if (angle < 30 && angle > -30) {
                    posX = 35;
                    posY = 0;
                } else if (angle < 60 && angle > 30) {
                    posX = 35;
                    posY = 35;
                } else if (angle < 120 && angle > 60) {
                    posX = 0;
                    posY = 35;
                } else if (angle < 150 && angle > 120) {
                    posX = -35;
                    posY = 35;
                } else if (angle < -150 || angle > 150) {
                    posX = -35;
                    posY = 0;
                } else if (angle < -120 && angle > -150) {
                    posX = -35;
                    posY = -35;
                } else if (angle < -60 && angle > -120) {
                    posX = 0;
                    posY = -35;
                } else if (angle < -30 && angle > -60) {
                    posX = 35;
                    posY = -35;
                }
            }
            iris.current.style.transform = `translate(${posX}px,${posY}px)`;
            pupil.current.style.transform = `translate(${reduceNumberBy(posX, pupilReduceDistance)}px,${reduceNumberBy(posY, pupilReduceDistance)}px)`;
        }
    };
    return (
        <div
            className="w-screen h-screen grid place-items-center bg-slate-800"
            onMouseMove={handleMouseOver}
        >
            <div className="relative grid place-items-center">
                <div
                    ref={iris}
                    className="absolute top-0 left-0 transition-all duration-300"
                >
                    <div className="relative">
                        <Image
                            alt=""
                            src={"/iris.svg"}
                            width={110}
                            height={110}
                            className="absolute scale-[0.8] opacity-90 transition-all duration-300"
                        />
                        <Image
                            alt=""
                            src={"/layer10.svg"}
                            width={110}
                            height={110}
                            className=" scale-125 opacity-90 transition-all duration-300"
                        />
                    </div>
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <div
                            ref={pupil}
                            className="relative transition-all duration-300"
                        >
                            <Image
                                alt=""
                                src={"/pupil.svg"}
                                width={35}
                                height={35}
                                className="scale-[0.8] transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute  top-0 left-0 transition-all duration-300">
                    <Image
                        alt=""
                        src={"/layer9.svg"}
                        width={255}
                        height={255}
                        className="animate-layer9"
                    />
                </div>
            </div>
        </div>
    );
}
