/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // temporary

        remotePatterns: [{ protocol: "https", hostname: "*", port: "" }],
    },
};

export default nextConfig;
