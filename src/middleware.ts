import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // Une liste de toutes les locales supportées
  locales: ['en', 'fr'],
 
  // La locale par défaut si aucune n'est détectée
  defaultLocale: 'fr'
});
 
export const config = {
  // Matcher pour ignorer les fichiers internes (_next), les images, etc.
  matcher: ['/', '/(fr|en)/:path*']
};