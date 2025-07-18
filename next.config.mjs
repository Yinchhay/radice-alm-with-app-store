/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        RECAPTCHA_KEY: process.env.RECAPTCHA_KEY,
    },
    images: {
        // temporary
        dangerouslyAllowSVG: true,
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
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    // If using Dockerfile, uncomment this
    // output: "standalone",
};

export default nextConfig;

// export default {
//     reactStrictMode: false,
//     swcMinify: false,
//     eslint: {
//       ignoreDuringBuilds: true,
//     },
//     typescript: {
//       ignoreBuildErrors: true,
//     },
//   };
