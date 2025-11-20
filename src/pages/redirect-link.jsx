import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { getUrl, incrementClick } from "@/db/apiUrls";

export default function RedirectLink() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, fn: fetchUrl } = useFetch(getUrl);

  // Fetch short URL record
  useEffect(() => {
    if (code) fetchUrl(code);
  }, [code, fetchUrl]);

  // Redirect user if record found
  useEffect(() => {
    const handleRedirect = async () => {
      // ignore Vercel health check like /healthz or bots
      if (!loading && !data?.url && code !== "healthz") {
        navigate("/", { replace: true });
        return;
      }

      if (!loading && data?.url) {
        try {
          await incrementClick(code);
        } catch {
          // Ignore analytics errors silently
        }
        window.location.replace(data.url);
      }
    };

    handleRedirect();
  }, [loading, data, code, navigate]);

  // 🧪 When unknown link AND not health check
  if (error && code !== "healthz") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold mb-2">404 — Link not found</h1>
        <p className="text-gray-400">
          This short link doesn't exist or was deleted.
        </p>
      </div>
    );
  }

  // ⏳ Loading UI
  return (
    <div className="p-10 text-center">
      <BarLoader width="100%" color="#36d7b7" />
      <p className="mt-4">Redirecting...</p>
    </div>
  );
}
