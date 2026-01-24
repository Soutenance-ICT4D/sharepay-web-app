"use client";

import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Link2Off, 
  Palette, 
  Settings2, 
  CreditCard, 
  Smartphone,
  Eye
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// --- Types & Helpers (Gardés identiques) ---
type StoredPaymentLinkRow = {
  id: string;
  applicationTarget?: string;
  title: string;
  description?: string;
  amountType?: "fixed" | "free";
  amountValue?: number;
  currency?: string;
  logoUrl?: string;
  themeColor?: string;
  redirectUrl?: string;
  expiresAt?: string;
  maxUses?: number;
  collectCustomerInfo?: boolean;
  createdAtLabel: string;
  amountLabel: string;
  payments: number;
  status: "ACTIVE" | "EXPIRED";
  urlLabel: string;
};

const STORAGE_KEY = "sharepay.paymentLinks";

function formatCreatedAtLabel(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 32);
}

function readStoredLinks(): StoredPaymentLinkRow[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredPaymentLinkRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function writeStoredLinks(rows: StoredPaymentLinkRow[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

// --- Composant de Preview ---
function PaymentPreview({ data }: { data: Partial<StoredPaymentLinkRow> }) {
  return (
    <div className="sticky top-8">
      <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        <Eye className="w-4 h-4" /> Aperçu en direct
      </div>
      <div className="relative mx-auto border-[8px] border-slate-900 rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl bg-white overflow-hidden">
        {/* Notch du téléphone */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-xl w-32 mx-auto z-10"></div>
        
        {/* Contenu du lien de paiement */}
        <div className="h-full overflow-y-auto pt-12 pb-8 px-6 flex flex-col items-center">
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Logo" className="w-16 h-16 rounded-full object-cover mb-4 border shadow-sm" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-dashed">
              <ImageIcon className="text-slate-300" />
            </div>
          )}
          
          <h4 className="text-lg font-bold text-center leading-tight mb-2">
            {data.title || "Titre de votre produit"}
          </h4>
          <p className="text-xs text-center text-slate-500 mb-6 line-clamp-3">
            {data.description || "La description de votre offre apparaîtra ici pour vos clients."}
          </p>

          <div className="w-full bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Montant à payer</span>
            <div className="text-2xl font-black" style={{ color: data.themeColor }}>
              {data.amountType === "free" ? "--" : data.amountValue?.toLocaleString()} {data.currency}
            </div>
          </div>

          <div className="w-full space-y-3 mt-auto">
             <div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />
             <div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />
             <Button 
                className="w-full h-12 rounded-xl font-bold shadow-lg transition-all"
                style={{ backgroundColor: data.themeColor, color: '#fff' }}
             >
               Payer maintenant
             </Button>
          </div>
          
          <p className="mt-6 text-[10px] text-slate-400 flex items-center gap-1">
            <Smartphone className="w-3 h-3" /> Sécurisé par SharePay
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Page Principale ---
export default function NewPaymentLinkPage() {
  const router = useRouter();

  // States
  const [applicationTarget, setApplicationTarget] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string>("");
  const [amountType, setAmountType] = useState<"fixed" | "free">("fixed");
  const [currency, setCurrency] = useState<string>("XAF");
  const [amount, setAmount] = useState("10000");
  const [status, setStatus] = useState<"ACTIVE" | "EXPIRED">("ACTIVE");
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [maxUses, setMaxUses] = useState<string>("");
  const [collectCustomerInfo, setCollectCustomerInfo] = useState<boolean>(true);
  const [logoMode, setLogoMode] = useState<"none" | "upload" | "url">("none");
  const [logoUrlInput, setLogoUrlInput] = useState<string>("");
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");
  const [themeColor, setThemeColor] = useState<string>("#098865");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (title.trim().length < 3) return false;
    if (amountType === "free") return true;
    const parsed = Number(amount);
    return Number.isFinite(parsed) && parsed > 0;
  }, [amount, amountType, title]);

  // Handler de soumission (identique au vôtre)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    if (cleanTitle.length < 3) {
      setError("Le titre doit contenir au moins 3 caractères.");
      return;
    }

    const amountValue = amountType === "fixed" ? Number(amount) : undefined;
    const logoUrl = logoMode === "url" ? logoUrlInput : logoMode === "upload" ? logoDataUrl : undefined;

    const now = new Date();
    const baseSlug = slugify(cleanTitle);
    const suffix = Math.random().toString(36).slice(2, 6);
    const slug = baseSlug.length ? `${baseSlug}-${suffix}` : suffix;

    const next: StoredPaymentLinkRow = {
      id: slug,
      applicationTarget: applicationTarget.trim() || undefined,
      title: cleanTitle,
      description: description.trim() || undefined,
      amountType,
      amountValue,
      currency,
      logoUrl,
      themeColor,
      redirectUrl: redirectUrl.trim() || undefined,
      expiresAt: expiresAt.trim() || undefined,
      maxUses: maxUses.trim() ? Number(maxUses) : undefined,
      collectCustomerInfo,
      createdAtLabel: `Créé le ${formatCreatedAtLabel(now)}`,
      amountLabel: amountType === "free" ? "Libre" : `${amountValue} ${currency}`,
      payments: 0,
      status,
      urlLabel: `pay.me/${slug}`,
    };

    const current = readStoredLinks();
    writeStoredLinks([next, ...current]);
    router.push("/dashboard/payment-link");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Nouveau lien de paiement</h2>
          <p className="text-muted-foreground">Créez une page de paiement personnalisée en quelques clics.</p>
        </div>
        <Button variant="ghost" className="w-fit" onClick={() => router.push("/dashboard/payment-link")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Annuler
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Colonne Formulaire */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Produit */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Link2Off className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Détails du produit</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Application cible</Label>
                        <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                            value={applicationTarget}
                            onChange={(e) => setApplicationTarget(e.target.value)}
                        >
                            <option value="">Aucune</option>
                            <option value="web">Web</option>
                            <option value="mobile">Mobile</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Statut initial</Label>
                        <select 
                             className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                             value={status}
                             onChange={(e) => setStatus(e.target.value as any)}
                        >
                            <option value="ACTIVE">Actif</option>
                            <option value="EXPIRED">Expiré</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Titre du paiement</Label>
                  <Input 
                    id="title" 
                    placeholder="Ex: Abonnement Salle de sport" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <textarea 
                    id="desc"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Détails additionnels pour vos clients..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Tarification */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Tarification</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de montant</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                    value={amountType}
                    onChange={(e) => setAmountType(e.target.value as any)}
                  >
                    <option value="fixed">Montant fixe</option>
                    <option value="free">Montant libre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Devise</Label>
                  <select 
                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                     value={currency}
                     onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="XAF">XAF</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              {amountType === "fixed" && (
                <div className="mt-4 space-y-2">
                  <Label>Montant</Label>
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg font-bold"
                  />
                </div>
              )}
            </div>

            {/* Section 3: Branding */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Personnalisation</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Logo du marchand</Label>
                  <div className="flex flex-col gap-2">
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                        value={logoMode}
                        onChange={(e) => setLogoMode(e.target.value as any)}
                    >
                        <option value="none">Pas de logo</option>
                        <option value="url">Lien URL</option>
                        <option value="upload">Fichier local</option>
                    </select>
                    {logoMode === 'url' && (
                        <Input placeholder="https://..." value={logoUrlInput} onChange={(e) => setLogoUrlInput(e.target.value)} />
                    )}
                    {logoMode === 'upload' && (
                        <Input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => setLogoDataUrl(reader.result as string);
                                reader.readAsDataURL(file);
                            }
                        }} />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Couleur d'accentuation</Label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={themeColor} 
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="h-10 w-12 rounded cursor-pointer border-none p-0"
                    />
                    <Input value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="font-mono uppercase" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Options Avancées */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                  <Settings2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Options avancées</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Redirection après succès</Label>
                  <Input placeholder="https://votre-site.com/merci" value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date d'expiration</Label>
                  <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-6 p-4 bg-muted/30 rounded-xl">
                 <input 
                    type="checkbox" 
                    id="collect" 
                    checked={collectCustomerInfo} 
                    onChange={(e) => setCollectCustomerInfo(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="collect" className="cursor-pointer">Collecter le nom et l'email du client lors du paiement</Label>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" disabled={!canSubmit} className="w-full h-14 text-lg font-black shadow-xl">
              Générer mon lien SharePay
            </Button>
          </form>
        </div>

        {/* Colonne Preview (Cachée sur mobile, visible sur LG) */}
        <div className="hidden lg:block lg:col-span-5">
          <PaymentPreview data={{
            title,
            description,
            amountValue: Number(amount),
            currency,
            amountType,
            themeColor,
            logoUrl: logoMode === 'url' ? logoUrlInput : logoDataUrl
          }} />
        </div>
      </div>
    </div>
  );
}