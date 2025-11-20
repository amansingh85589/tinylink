import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="TinyLink" className="h-8" />
            <span className="font-bold text-lg">TinyLink</span>
          </Link>
          <Button asChild variant="outline" size="sm">
            <a href="/healthz" target="_blank" rel="noreferrer">
              Healthcheck
            </a>
          </Button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
