import { Roboto_Condensed } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function Footer() {
    return (
        <footer className="bg-black text-white py-8">
            <div className="container mx-auto grid grid-cols-4 gap-8">
                <div className="col-span-2 max-w-[560px]">
                    <Link href={"/"} className="text-white text-lg font-bold">
                        <Image
                            src={"/RadiceLogo_dark.png"}
                            width={200}
                            height={200}
                            alt="Radice"
                        />
                    </Link>
                    <h1 className="opacity-0 fixed pointer-events-none">
                        Radice
                    </h1>
                    <p className="text-gray-200 mt-4">
                        Radice is a center for applied research and development
                        initiatives of{" "}
                        <span>
                            <Link
                                href="https://paragoniu.edu.kh/"
                                target="_blank"
                                className="hover:underline"
                            >
                                Paragon International University
                            </Link>
                        </span>
                        . We are a hub of creativity and discovery, where ideas
                        take flight and possibilities are endless. Radice is
                        passionate about innovation and creativity, and strives
                        to deliver high-quality results.
                    </p>
                    <div
                        className={`mt-8 text-white font-bold ${roboto_condensed.className}`}
                    >
                        <p>Powered By ParagonIU Cloud</p>
                        <p>Copyright &copy; All Rights Reserved. 2024 RaDICe</p>
                    </div>
                </div>
                <div>
                    <h2 className={`font-bold mb-4 text-xl`}>Contact Us</h2>
                    <p>
                        <span className="font-bold">Email</span>:
                        radi@paragoniu.edu.kh
                    </p>
                </div>
                <div>
                    <h2 className={`font-bold mb-4 text-xl`}>Find Us</h2>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.5734929449427!2d104.89540667581117!3d11.582402688619641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109517bf7757d23%3A0x965c34888684bf1!2sParagon%20International%20University!5e0!3m2!1sen!2skh!4v1719135679821!5m2!1sen!2skh"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        className="w-full h-[200px]"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </footer>
    );
}
