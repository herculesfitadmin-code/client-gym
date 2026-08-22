// Robots.txt generator config for Hercules Fitness
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
    },
    sitemap: 'https://www.herculesfit.in/sitemap.xml',
  };
}
