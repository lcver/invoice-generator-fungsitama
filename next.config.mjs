/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.hbs$/,
      loader: 'handlebars-loader',
      options: {
        knownHelpersOnly: false,
      },
    });
    config.resolve.extensions.push('.hbs');
    return config;
  },
};

export default nextConfig;
