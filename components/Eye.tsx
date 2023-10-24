"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Eye() {
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
                src={"/layer11.svg"}
                width={570}
                height={570}
                className="absolute animate-layer11 opacity-25"
            />
            <Image
                alt=""
                src={"/layer1.svg"}
                width={800}
                height={800}
                className="absolute animate-layer1 opacity-50"
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
                alt=""
                src={"/layer10.svg"}
                width={110}
                height={110}
                className="absolute animate-layer10 scale-[0.8] opacity-90"
            />
            <Image
                alt=""
                src={"/pupil.svg"}
                width={35}
                height={35}
                className="absolute animate-pupil scale-[0.8]"
            />
        </div>
    );
}
