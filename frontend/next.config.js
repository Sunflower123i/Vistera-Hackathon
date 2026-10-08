const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
  },
  eslint: {
      ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

