/** @type {import('next').NextConfig} */
const nextConfig = {
    // https://lucia-auth.com/getting-started/nextjs-app
    // prevent it from getting bundled. This is only required when using the oslo/password module.
    webpack: (config) => {
		config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
		return config;
	},
};

export default nextConfig;
