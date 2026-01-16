import { Link } from "@/i18n/routing";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Page en cours d’implémentation.</p>
      </div>

      <div>
        <Link
          href="/dashboard/settings/preferences"
          className="text-sm text-primary hover:underline"
        >
          Aller vers Preferences
        </Link>
      </div>
    </div>
  );
}
