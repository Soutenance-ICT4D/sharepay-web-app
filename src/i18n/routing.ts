import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation'; // <--- Changement ici
 
export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'fr'
});
 
// createNavigation remplace createSharedPathnamesNavigation
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);