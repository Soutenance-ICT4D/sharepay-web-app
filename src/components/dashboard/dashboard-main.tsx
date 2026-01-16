import { ReactNode } from "react";

export function DashboardMain({
  appBar,
  children,
}: {
  appBar: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
      {appBar}
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
        {children}
      </div>
    </main>
  );
}
