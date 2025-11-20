/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Copy, Trash, Download } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";

const LinkCard = ({ url, refresh }) => {
  const { loading, fn: fnDelete } = useFetch(deleteUrl);

  const handleDelete = async () => {
    await fnDelete(url.id);
    refresh();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${url.code}`);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = url.qr;
    a.download = `${url.code}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url.qr}
        alt="qr code"
        className="h-24 w-24 object-contain ring ring-blue-500 self-start"
      />

      <div className="flex flex-col flex-1">
        <Link
          to={`/code/${url.code}`}
          className="text-2xl font-extrabold hover:underline cursor-pointer"
        >
          {url.title}
        </Link>

        <button
          type="button"
          onClick={handleCopy}
          className="text-blue-400 text-sm text-left hover:underline"
        >
          {window.location.origin}/{url.code}
        </button>

        <span className="text-xs text-gray-400 truncate mt-1">
          {url.url}
        </span>

        <span className="text-xs text-gray-500 mt-auto">
          Clicks: {url.total_clicks ?? 0} ·{" "}
          {url.last_clicked
            ? new Date(url.last_clicked).toLocaleString()
            : "Never clicked"}
        </span>
      </div>

      <div className="flex gap-2 self-start">
        <Button variant="ghost" size="icon" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={loading}
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
