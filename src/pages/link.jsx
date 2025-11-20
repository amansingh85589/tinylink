import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Link as LinkIcon } from "lucide-react";

import useFetch from "@/hooks/use-fetch";
import { getUrl } from "@/db/apiUrls";
import Error from "@/components/error";

const LinkPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const {
    data: url,
    loading,
    error,
    fn: fetchUrl,
  } = useFetch(getUrl);

  useEffect(() => {
    fetchUrl(code);
  }, [code]);

  useEffect(() => {
    if (error) navigate("/");
  }, [error]);

  if (loading && !url) {
    return (
      <div>
        <BarLoader width="100%" color="#36d7b7" />
        <p className="mt-4 text-center">Loading link details...</p>
      </div>
    );
  }

  if (!url) return null;

  const shortUrl = `${window.location.origin}/${url.code}`;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold">
            {url.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Short URL:</span>
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline break-all"
            >
              {shortUrl}
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigator.clipboard.writeText(shortUrl)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <a
              href={url.url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline break-all"
            >
              {url.url}
            </a>
          </div>

          <div className="flex flex-col text-sm text-gray-400 gap-1">
            <span>Clicks: {url.total_clicks ?? 0}</span>
            <span>
              Last clicked:{" "}
              {url.last_clicked
                ? new Date(url.last_clicked).toLocaleString()
                : "Never"}
            </span>
            <span>
              Created at:{" "}
              {url.created_at
                ? new Date(url.created_at).toLocaleString()
                : "-"}
            </span>
          </div>

          <img
            src={url.qr}
            alt="QR code"
            className="w-40 h-40 object-contain ring ring-blue-500 mt-4"
          />
        </CardContent>
      </Card>

      {error && <Error message={error.message} />}
    </div>
  );
};

export default LinkPage;
