import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Error from "./error";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/apiUrls";
import { QRCode } from "react-qrcode-logo";

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const CreateLink = ({ onCreated }) => {
  const [form, setForm] = useState({
    title: "",
    longUrl: "",
    customUrl: "",
  });
  const [errors, setErrors] = useState({});
  const qrRef = useRef(null);

  const { data, loading, error, fn: fnCreate } = useFetch(createUrl);

  useEffect(() => {
    if (data?.code && onCreated) {
      onCreated();
    }
  }, [data, onCreated]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.longUrl.trim()) newErrors.longUrl = "URL is required";
    else if (!isValidUrl(form.longUrl)) newErrors.longUrl = "Enter a valid URL";
    if (form.customUrl && !/^[A-Za-z0-9]{6,8}$/.test(form.customUrl))
      newErrors.customUrl = "Code must be 6-8 letters/numbers";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    const canvas = qrRef.current?.canvasRef.current;
    if (!canvas) return;

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

    await fnCreate(
      {
        title: form.title.trim(),
        longUrl: form.longUrl.trim(),
        customUrl: form.customUrl.trim() || null,
      },
      blob
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="create-link-desc" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Short Link</DialogTitle>
          <p id="create-link-desc" className="text-xs text-gray-400">
            Enter a long URL and optional custom code.
          </p>
        </DialogHeader>

        {form.longUrl && (
          <div className="flex justify-center mb-4">
            <QRCode ref={qrRef} value={form.longUrl} size={180} />
          </div>
        )}

        <div className="space-y-2">
          <Input
            id="title"
            placeholder="Title (e.g., My Docs)"
            value={form.title}
            onChange={handleChange}
          />
          <Error message={errors.title} />

          <Input
            id="longUrl"
            placeholder="https://example.com/very/long/url"
            value={form.longUrl}
            onChange={handleChange}
          />
          <Error message={errors.longUrl} />

          <Input
            id="customUrl"
            placeholder="Custom code (6–8 chars, optional)"
            value={form.customUrl}
            onChange={handleChange}
          />
          <Error message={errors.customUrl} />
        </div>

        {error && <Error message={error.message} />}

        <div className="flex justify-end mt-4">
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
