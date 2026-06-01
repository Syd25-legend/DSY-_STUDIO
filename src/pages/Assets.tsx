// src/pages/Assets.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Github,
  LayoutGrid,
  List,
  Package,
  Code2,
  FileCode,
  Music,
  Box,
  Filter,
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import Card3D from "@/components/Card3D";
import ScrollProgress from "@/components/ScrollProgress";
import SEO from "@/components/SEO";
import BouncyLoader from "@/components/BouncyLoader";
import { motion, Variants } from "framer-motion";
import { getRawUrl, detectLanguage, isZipUrl, getRepoHtmlUrl } from "@/utils/github";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Asset {
  id: string;
  title: string;
  description: string;
  category: string | null;
  tags: string[] | null;
  image: string | null;
  github_url: string | null;
  download_url: string | null;
  file_name: string | null;
  license: string | null;
  version: string | null;
  featured: boolean;
  created_at: string;
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const titleVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "All", value: "all", icon: Filter },
  { label: "Scripts", value: "Scripts", icon: Code2 },
  { label: "Shaders", value: "Shaders", icon: FileCode },
  { label: "Audio", value: "Audio", icon: Music },
  { label: "3D Models", value: "3D Models", icon: Box },
];

const categoryIcon = (cat: string | null) => {
  switch (cat) {
    case "Scripts":
      return <Code2 className="w-4 h-4" />;
    case "Shaders":
      return <FileCode className="w-4 h-4" />;
    case "Audio":
      return <Music className="w-4 h-4" />;
    case "3D Models":
      return <Box className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

// ─── Thumbnail Card ────────────────────────────────────────────────────────────

const ThumbnailCard = ({ asset }: { asset: Asset }) => {
  // Prefer explicit download_url (GitHub Release), fall back to raw file URL
  const downloadUrl =
    asset.download_url ||
    (asset.github_url && !isZipUrl(asset.github_url)
      ? getRawUrl(asset.github_url)
      : asset.github_url) ||
    null;

  return (
    <Card3D intensity={0.5}>
      <Card className="gaming-card group overflow-hidden flex flex-col h-full">
        <Link to={`/assets/${asset.id}`} className="flex flex-col flex-grow">
          {/* Thumbnail */}
          <div className="relative overflow-hidden">
            {asset.image ? (
              <img
                src={asset.image}
                alt={asset.title}
                className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-44 flex flex-col items-center justify-center bg-muted/30 border-b border-border relative overflow-hidden">
                {/* Decorative grid */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    {categoryIcon(asset.category)}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {asset.file_name || asset.category || "Asset"}
                  </span>
                </div>
              </div>
            )}
            {/* Featured badge */}
            {asset.featured && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5">
                  Featured
                </Badge>
              </div>
            )}
            {/* Version badge */}
            {asset.version && (
              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-0.5">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {asset.version}
                </span>
              </div>
            )}
          </div>

          {/* Card body */}
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-base group-hover:text-primary transition-colors leading-snug">
                {asset.title}
              </CardTitle>
              <Badge
                variant="outline"
                className="text-[10px] flex-shrink-0 flex items-center gap-1"
              >
                {categoryIcon(asset.category)}
                {asset.category}
              </Badge>
            </div>
            <CardDescription className="text-xs line-clamp-2 mt-1">
              {asset.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-3 pt-0">
            <div className="flex flex-wrap gap-1">
              {asset.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
              {(asset.tags?.length ?? 0) > 3 && (
                <Badge variant="secondary" className="text-[10px]">
                  +{asset.tags!.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
        </Link>

        {/* Actions */}
        <div className="p-4 pt-0 mt-auto flex gap-2">
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={asset.file_name || true}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="gaming"
                size="sm"
                className="w-full text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </a>
          )}
          {asset.github_url && (
            <a
              href={getRepoHtmlUrl(asset.github_url)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="outline" size="sm" className="text-xs px-3">
                <Github className="w-3 h-3" />
              </Button>
            </a>
          )}
        </div>
      </Card>
    </Card3D>
  );
};

// ─── List Row ─────────────────────────────────────────────────────────────────

const ListRow = ({ asset }: { asset: Asset }) => {
  // Prefer explicit download_url (GitHub Release), fall back to raw file URL
  const downloadUrl =
    asset.download_url ||
    (asset.github_url ? getRawUrl(asset.github_url) : null);
  const lang = asset.file_name ? detectLanguage(asset.file_name) : null;

  return (
    <motion.div variants={itemVariants}>
      <div className="gaming-card rounded-xl px-4 py-3 flex items-center gap-4 group hover:border-primary/40 transition-colors">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          {categoryIcon(asset.category)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/assets/${asset.id}`}
              className="font-medium text-sm text-foreground hover:text-primary transition-colors truncate"
            >
              {asset.title}
            </Link>
            {asset.featured && (
              <Badge className="bg-accent text-accent-foreground text-[10px] py-0">
                Featured
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {asset.file_name && (
              <span className="text-[11px] font-mono text-muted-foreground">
                {asset.file_name}
              </span>
            )}
            {lang && lang !== "plaintext" && (
              <span className="text-[10px] text-primary/60 font-mono uppercase">
                {lang}
              </span>
            )}
          </div>
        </div>

        {/* Category */}
        <Badge
          variant="outline"
          className="text-[10px] hidden sm:flex items-center gap-1 flex-shrink-0"
        >
          {categoryIcon(asset.category)}
          {asset.category}
        </Badge>

        {/* License */}
        {asset.license && (
          <span className="text-[10px] text-muted-foreground hidden md:block flex-shrink-0 font-mono">
            {asset.license}
          </span>
        )}

        {/* Version */}
        {asset.version && (
          <span className="text-[10px] text-muted-foreground hidden lg:block flex-shrink-0 font-mono">
            {asset.version}
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={asset.file_name || true}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="gaming" size="sm" className="text-xs h-8 px-3">
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </a>
          )}
          {asset.github_url && (
            <a href={getRepoHtmlUrl(asset.github_url)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="h-8 px-2">
                <Github className="w-3 h-3" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"thumbnail" | "list">("thumbnail");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const { data, error } = await supabase
          .from("assets")
          .select("*")
          .order("featured", { ascending: false })
          .order("created_at", { ascending: false });
        if (error) throw error;
        setAssets((data as Asset[]) || []);
      } catch (err) {
        console.error("Error fetching assets:", err);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const filtered =
    activeCategory === "all"
      ? assets
      : assets.filter((a) => a.category === activeCategory);

  if (loading) return <BouncyLoader isLoading={loading} />;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <ScrollProgress />
      <SEO
        title="Game Assets"
        description="Free downloadable game development assets from DSY Studio — Unity scripts, shaders, audio tools and more. Open source, MIT licensed."
        canonical="/assets"
      />
      <GamingHeader />

      <div className="container mx-auto px-4 pt-32 pb-20">

        {/* ── Hero ─────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-mono mb-6">
            <Package className="w-3.5 h-3.5" />
            Free & Open Source
          </div>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Game Assets
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scripts, shaders, and tools built for{" "}
            <span className="text-primary">Antim Yatra</span> — shared freely
            with the game dev community.
          </p>
        </motion.div>

        {/* ── Controls Bar ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Category filter chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                id={`category-filter-${value}`}
                onClick={() => setActiveCategory(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                  ${
                    activeCategory === value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
              >
                <Icon className="w-3 h-3" />
                {label}
                {value !== "all" && (
                  <span className="opacity-60 ml-0.5">
                    ({assets.filter((a) => a.category === value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-muted/30 border border-border rounded-lg p-1 flex-shrink-0">
            <button
              id="view-toggle-thumbnail"
              onClick={() => setView("thumbnail")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                ${
                  view === "thumbnail"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Grid
            </button>
            <button
              id="view-toggle-list"
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                ${
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>
        </div>

        {/* ── Empty State ───────────────────────────────────── */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No assets found in this category yet.
            </p>
          </div>
        )}

        {/* ── Thumbnail Grid ────────────────────────────────── */}
        {view === "thumbnail" && filtered.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {filtered.map((asset) => (
              <motion.div key={asset.id} variants={itemVariants}>
                <ThumbnailCard asset={asset} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── List View ─────────────────────────────────────── */}
        {view === "list" && filtered.length > 0 && (
          <motion.div
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* List header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_80px_80px_160px] gap-4 px-4 py-2 text-[11px] text-muted-foreground font-mono uppercase tracking-widest">
              <span>Asset</span>
              <span>Category</span>
              <span>License</span>
              <span>Version</span>
              <span className="text-right">Actions</span>
            </div>
            {filtered.map((asset) => (
              <ListRow key={asset.id} asset={asset} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Assets;
