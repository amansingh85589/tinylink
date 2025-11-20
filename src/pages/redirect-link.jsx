import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { getUrl, incrementClick } from "@/db/apiUrls";

const RedirectLink = () => {
  const { code } = useParams();
  const { data, loading, error, fn: fetchUrl } = useFetch(getUrl);

  useEffect(() => {
    fetchUrl(code);
  }, [code]);

  useEffect(() => {
    const go = async () => {
      if (!loading && data?.url) {
        try {
          await incrementClick(code);
        } catch {
          // ignore analytics failure
        }
        window.location.replace(data.url);
      }
    };
    go();
  }, [loading, data, code]);

  if (error) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold mb-2">404 — Link not found</h1>
        <p className="text-gray-400">This short code does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-10 text-center">
      <BarLoader width="100%" color="#36d7b7" />
      <p className="mt-4">Redirecting...</p>
    </div>
  );
};

export default RedirectLink;
