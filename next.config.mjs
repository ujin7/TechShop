/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.samsung.com' },
      { protocol: 'https', hostname: 'image-us.samsung.com' },
      { protocol: 'https', hostname: 'store.storeimages.cdn-apple.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'www.sony.com' },
      { protocol: 'https', hostname: 'www.lg.com' },
      { protocol: 'https', hostname: 'dlcdnwebimgs.asus.com' },
      { protocol: 'https', hostname: 'p3-ofp.static.pub' },
      { protocol: 'https', hostname: 'storage-asset.msi.com' },
      { protocol: 'https', hostname: 'i.dell.com' },
      { protocol: 'https', hostname: 'zowie.benq.com' },
      { protocol: 'https', hostname: 'assets.bose.com' },
      { protocol: 'https', hostname: 'www.sonos.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'resource.logitech.com' },
      { protocol: 'https', hostname: 'www.baseus.com' },
      { protocol: 'https', hostname: 'www.jabra.com' },
      { protocol: 'https', hostname: 'hybrismediaprod.blob.core.windows.net' },
    ],
  },
};

export default nextConfig;
