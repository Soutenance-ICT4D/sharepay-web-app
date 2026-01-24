"use client";

import { useState } from "react";
import Link from "next/link";
import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaymentLinkTipCard({
  title,
  description,
  linkLabel,
  linkHref,
}: {
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex items-start gap-4">
      <div className="p-2 bg-primary/10 text-primary rounded-lg">
        <Lightbulb className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm mb-1 text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}{" "}
          <Link className="text-primary font-bold hover:underline" href={linkHref}>
            {linkLabel}
          </Link>
          .
        </p>
      </div>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setVisible(false)}>
        <X className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
