import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { BarLoader } from "react-spinners";

import useFetch from "@/hooks/use-fetch";
import { getUrls } from "@/db/apiUrls";
import CreateLink from "@/components/create-link";
import LinkCard from "@/components/link-card";
import Error from "@/components/error";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const {
    data: urls,
    loading,
    error,
    fn: fetchUrls,
  } = useFetch(getUrls);

  useEffect(() => {
    fetchUrls();
  }, []);

  const filtered = useMemo(() => {
    if (!urls) return [];
    const q = search.toLowerCase();
    return urls.filter(
      (u) =>
        u.code.toLowerCase().includes(q) ||
        u.url.toLowerCase().includes(q) ||
        (u.title || "").toLowerCase().includes(q)
    );
  }, [urls, search]);

  const totalClicks = urls?.reduce(
    (sum, u) => sum + (u.total_clicks ?? 0),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      {loading && <BarLoader width="100%" color="#36d7b7" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{urls?.length ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalClicks ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold">My Links</h1>
        <CreateLink onCreated={fetchUrls} />
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Filter by code, title or URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-3 pr-9"
        />
        <Filter className="absolute top-2 right-2 h-5 w-5 opacity-70" />
      </div>

      {error && <Error message={error.message} />}

      <div className="flex flex-col gap-4">
        {filtered.length === 0 && !loading && (
          <p className="text-sm text-gray-400">
            No links yet. Create your first short link!
          </p>
        )}
        {filtered.map((url) => (
          <LinkCard key={url.id} url={url} refresh={fetchUrls} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
