import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  const locales = routing.locales as readonly string[];

  // Si la locale n'est pas valide, on force celle par défaut
  if (!locale || !locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale, 
    messages: (await import(`../messages/${locale}.json`)).default
  };
});