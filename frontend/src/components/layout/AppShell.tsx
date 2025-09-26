import * as React from "react";
import { Card } from "@/components/ui/card";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <Card className="p-4 md:p-6">{children}</Card>
    </div>
  );
}