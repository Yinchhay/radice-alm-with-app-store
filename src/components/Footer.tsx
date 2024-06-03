export default function Footer() {
    return (
        <footer className="bg-black text-white py-8">
            <div className="container mx-auto grid grid-cols-4 gap-8">
                <div className="col-span-2 max-w-[560px]">
                    <h1 className="uppercase text-4xl font-bold mb-4">
                        Radice
                    </h1>
                    <p className="text-gray-200">
                        Radice is a Center for applied research and development
                        initiatives of Paragon International University that
                        helps other companies bring their ideas to life through
                        research and development. Radice is passionate about
                        innovation and creativity, and strives to deliver
                        high-quality results.
                    </p>
                    <div className="mt-8 text-gray-200">
                        <p>Powered By ParagonIU Cloud</p>
                        <p>Copyright (C) All Rights Reserved. 2024 RaDICe</p>
                    </div>
                </div>
                <div>
                    <h2 className="font-bold mb-4 text-xl">Contact Us</h2>
                    <p>
                        <span className="font-bold">Email</span>:
                        radi@paragoniu.edu.kh
                    </p>
                </div>
                <div>
                    <h2 className="font-bold mb-4 text-xl">Find Us</h2>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5527.528634149702!2d104.89651954046957!3d11.583869747821607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109517bf7757d23%3A0x965c34888684bf1!2sParagon%20International%20University!5e0!3m2!1sen!2skh!4v1716161243182!5m2!1sen!2skh"
                        className="w-full h-[200px]"
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </footer>
    );
}
