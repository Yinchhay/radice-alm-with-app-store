/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // temporary

        remotePatterns: [{ protocol: "https", hostname: "*", port: "" }],
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        // TODO: remove this when all type errors are fixed
        // ignoreBuildErrors: true,
    },
    // If using Dockerfile, uncomment this
    // output: "standalone",
};

export default nextConfig;
