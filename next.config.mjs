/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Suas configurações específicas para imagens, se necessário
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({ test: /\.node$/, use: 'raw-loader' });

    if (!isServer) config.externals = [...(config.externals || []), 'canvas'];

    return config;
  },
};

export default nextConfig;
