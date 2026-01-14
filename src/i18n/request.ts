import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
 
  // Si la locale n'est pas valide, on force celle par défaut
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale, // <--- C'est cette ligne qui manquait et causait l'erreur
    messages: (await import(`../messages/${locale}.json`)).default
  };
});