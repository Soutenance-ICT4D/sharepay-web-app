import { ReactNode } from "react";

// Pour les composants UI standards
export interface BaseProps {
  children?: ReactNode;
  className?: string;
}

// Pour les pages Next.js (Server Components)
// Note : params est une Promise en Next.js 15+
export interface PageProps<T = Record<string, string>> {
  params: Promise<T>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Pour les icônes
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}