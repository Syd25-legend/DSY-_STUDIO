// src/pages/AssetDetail.tsx

import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Github,
  ArrowLeft,
  FileCode,
  Copy,
  Check,
  Package,
  ExternalLink,
  Tag,
  Code2,
  Music,
  Box,
  Loader2,
  AlertCircle,
  FileArchive,
  FolderOpen,
} from "lucide-react";
import GamingHeader from "@/components/GamingHeader";
import { supabase } from "@/integrations/supabase/client";
import ScrollProgress from "@/components/ScrollProgress";
import SEO from "@/components/SEO";
import BouncyLoader from "@/components/BouncyLoader";
import { motion } from "framer-motion";
import { Asset } from "./Assets";
import {
  fetchFileContent,
  fetchFolderContents,
  getRawUrl,
  detectLanguage,
  formatFileSize,
  isZipUrl,
  parseGitHubUrl,
  getRepoHtmlUrl,
  GitHubFileInfo,
  GitHubDirEntry,
} from "@/utils/github";

// ─── Category icon helper ─────────────────────────────────────────────────────

const categoryIcon = (cat: string | null) => {
  switch (cat) {
    case "Scripts": return <Code2 className="w-4 h-4" />;
    case "Shaders": return <FileCode className="w-4 h-4" />;
    case "Audio":   return <Music className="w-4 h-4" />;
    case "3D Models": return <Box className="w-4 h-4" />;
    default:        return <Package className="w-4 h-4" />;
  }
};

// ─── Code Block ───────────────────────────────────────────────────────────────

const CodeBlock = ({
  code,
  language,
  fileName,
}: {
  code: string;
  language: string;
  fileName: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="rounded-xl overflow-hidden border border-primary/20 bg-[hsl(220_15%_5%)]">
      {/* Terminal header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[hsl(220_15%_8%)] border-b border-primary/10">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {fileName}
          </span>
          <Badge variant="outline" className="text-[10px] font-mono py-0 h-4">
            {language}
          </Badge>
        </div>
        <button
          id="code-copy-btn"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-primary/10"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="w-full text-xs font-mono">
          <tbody>
            {lines.map((line, i) => (
              <tr
                key={i}
                className="hover:bg-primary/5 transition-colors group"
              >
                <td className="select-none text-right pr-4 pl-4 py-0.5 text-muted-foreground/40 w-12 text-[11px] border-r border-primary/5 group-hover:text-muted-foreground/60">
                  {i + 1}
                </td>
                <td className="pl-4 pr-4 py-0.5 text-foreground/85 whitespace-pre leading-5">
                  {line || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Folder File Tree ─────────────────────────────────────────────────────────

const FileTree = ({ files }: { files: GitHubDirEntry[] }) => (
  <div className="rounded-xl border border-primary/20 bg-[hsl(220_15%_5%)] overflow-hidden">
    <div className="px-4 py-2.5 bg-[hsl(220_15%_8%)] border-b border-primary/10 flex items-center gap-2">
      <FolderOpen className="w-4 h-4 text-accent" />
      <span className="text-xs font-mono text-muted-foreground">
        {files.length} file{files.length !== 1 ? "s" : ""}
      </span>
    </div>
    <div className="divide-y divide-primary/5">
      {files.map((f) => (
        <div
          key={f.path}
          className="flex items-center justify-between px-4 py-2.5 hover:bg-primary/5 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <FileCode className="w-3.5 h-3.5 text-primary/50" />
            <span className="text-xs font-mono text-foreground/80">{f.name}</span>
            <span className="text-[10px] text-muted-foreground/50 font-mono">
              {formatFileSize(f.size)}
            </span>
          </div>
          {f.download_url && (
            <a
              href={f.download_url}
              download={f.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-3 h-3" />
              </Button>
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [related, setRelated] = useState<Asset[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  // GitHub live data
  const [githubFile, setGithubFile] = useState<GitHubFileInfo | null>(null);
  const [githubFolder, setGithubFolder] = useState<GitHubDirEntry[]>([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState(false);

  // Fetch asset from Supabase
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const { data, error } = await supabase
          .from("assets")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setAsset(data as Asset);
      } catch {
        setAsset(null);
      } finally {
        setPageLoading(false);
      }
    };
    if (id) fetchAsset();
  }, [id]);

  // Fetch related assets
  useEffect(() => {
    if (!asset?.category) return;
    const fetchRelated = async () => {
      const { data } = await supabase
        .from("assets")
        .select("*")
        .eq("category", asset.category)
        .neq("id", asset.id)
        .limit(3);
      setRelated((data as Asset[]) || []);
    };
    fetchRelated();
  }, [asset]);

  // Fetch live GitHub data
  const fetchGitHubData = useCallback(async (url: string) => {
    setGithubLoading(true);
    setGithubError(false);
    try {
      const parsed = parseGitHubUrl(url);
      if (!parsed) throw new Error("Invalid GitHub URL");

      if (parsed.type === "dir") {
        const files = await fetchFolderContents(url);
        setGithubFolder(files);
      } else {
        const file = await fetchFileContent(url);
        if (file) setGithubFile(file);
        else throw new Error("Failed to fetch");
      }
    } catch {
      setGithubError(true);
    } finally {
      setGithubLoading(false);
    }
  }, []);

  useEffect(() => {
    if (asset?.github_url && !isZipUrl(asset.github_url)) {
      fetchGitHubData(asset.github_url);
    }
  }, [asset, fetchGitHubData]);

  if (pageLoading) return <BouncyLoader isLoading={pageLoading} />;

  if (!asset) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center">
        <GamingHeader />
        <p className="text-muted-foreground">Asset not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/assets")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Assets
        </Button>
      </div>
    );
  }

  const parsed = asset.github_url ? parseGitHubUrl(asset.github_url) : null;
  const isFolder = parsed?.type === "dir";
  // Consider it a zip if download_url exists and ends in .zip, OR github_url itself is a zip
  const isZip =
    (asset.download_url ? isZipUrl(asset.download_url) : false) ||
    (asset.github_url ? isZipUrl(asset.github_url) : false);
  // Use explicit download_url (Release asset) first, then fall back to raw GitHub URL
  const downloadUrl =
    asset.download_url ||
    (asset.github_url ? getRawUrl(asset.github_url) : null);
  // Derive file name from download_url path if no file_name set
  const releaseFileName = asset.download_url
    ? asset.download_url.split("/").pop() || null
    : null;
  const displayFileName =
    githubFile?.name || asset.file_name || releaseFileName || "Unknown file";
  const displaySize = githubFile
    ? formatFileSize(githubFile.size)
    : null;
  const displayLang = detectLanguage(displayFileName);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <ScrollProgress />
      <SEO
        title={asset.title}
        description={asset.description}
        canonical={`/assets/${asset.id}`}
      />
      <GamingHeader />

      <div className="container mx-auto px-4 pt-28 pb-20">

        {/* ── Back link ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/assets"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All Assets
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main column ───────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="gaming-card rounded-2xl overflow-hidden"
            >
              {/* Thumbnail or gradient banner */}
              {asset.image ? (
                <img
                  src={asset.image}
                  alt={asset.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div
                  className="w-full h-32 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(220 15% 10%), hsl(220 15% 14%))",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      {categoryIcon(asset.category)}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Title + badges */}
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold gradient-text flex-1">
                    {asset.title}
                  </h1>
                  {asset.featured && (
                    <Badge className="bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5"
                  >
                    {categoryIcon(asset.category)}
                    {asset.category}
                  </Badge>
                  {asset.version && (
                    <Badge variant="secondary" className="font-mono">
                      {asset.version}
                    </Badge>
                  )}
                  {asset.license && (
                    <Badge variant="outline" className="font-mono text-[11px]">
                      <Tag className="w-3 h-3 mr-1" />
                      {asset.license}
                    </Badge>
                  )}
                  {displaySize && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {displaySize}
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {asset.description}
                </p>

                {/* Tags */}
                {asset.tags && asset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {asset.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── Code / Folder view ───────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {(isFolder || (!isZip && githubFile)) && (
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  {isFolder ? (
                    <>
                      <FolderOpen className="w-5 h-5 text-accent" />
                      File Contents
                    </>
                  ) : (
                    <>
                      <Code2 className="w-5 h-5 text-accent" />
                      Source Code
                      <span className="text-xs text-muted-foreground font-normal ml-1">
                        — live from GitHub
                      </span>
                    </>
                  )}
                </h2>
              )}

              {/* Folder file tree */}
              {isFolder && githubLoading && (
                <div className="gaming-card rounded-xl p-8 flex items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Fetching from GitHub…</span>
                </div>
              )}
              {isFolder && !githubLoading && githubFolder.length > 0 && (
                <FileTree files={githubFolder} />
              )}

              {/* Single file code block */}
              {!isFolder && !isZip && githubLoading && (
                <div className="gaming-card rounded-xl p-8 flex items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Fetching live code from GitHub…</span>
                </div>
              )}

              {!isFolder && !isZip && githubError && (
                <div className="gaming-card rounded-xl p-6 flex items-center gap-3 text-muted-foreground border-destructive/20">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Could not load live code
                    </p>
                    <p className="text-xs mt-0.5">
                      GitHub API rate limited or repo is private.{" "}
                      <a
                        href={asset.github_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View on GitHub →
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {!isFolder && !isZip && githubFile && (
                <CodeBlock
                  code={githubFile.content}
                  language={displayLang}
                  fileName={githubFile.name}
                />
              )}
            </motion.div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────── */}
          <div className="space-y-5 sticky top-28">

            {/* Action card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="gaming-card rounded-2xl p-5 space-y-3"
            >
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                Get This Asset
              </h3>

              {/* Download button */}
              {downloadUrl && (
                <a
                  id="asset-download-btn"
                  href={downloadUrl}
                  download={asset.file_name || true}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="gaming" className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    {isZip ? "Download Package" : "Download File"}
                  </Button>
                </a>
              )}

              {/* GitHub buttons */}
              {asset.github_url && (
                <>
                  <a
                    id="asset-github-btn"
                    href={getRepoHtmlUrl(asset.github_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full">
                      <Github className="w-4 h-4 mr-2" />
                      View on GitHub
                      <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                    </Button>
                  </a>
                  {/* Raw/direct link for non-zips */}
                  {!isZip && (
                    <a
                      href={getRawUrl(asset.github_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" className="w-full text-xs text-muted-foreground">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Raw File URL
                      </Button>
                    </a>
                  )}
                </>
              )}

              {/* File info */}
              <div className="pt-2 border-t border-primary/10 space-y-2.5">
                {displayFileName && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">File</span>
                    <span className="font-mono truncate ml-4 max-w-[140px] text-right">
                      {displayFileName}
                    </span>
                  </div>
                )}
                {displayLang && displayLang !== "plaintext" && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Language</span>
                    <span className="font-mono uppercase">{displayLang}</span>
                  </div>
                )}
                {displaySize && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-mono">{displaySize}</span>
                  </div>
                )}
                {asset.license && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">License</span>
                    <span className="font-mono">{asset.license}</span>
                  </div>
                )}
                {asset.version && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Version</span>
                    <span className="font-mono">{asset.version}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Related assets */}
            {related.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="gaming-card rounded-2xl p-5"
              >
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  More {asset.category}
                </h3>
                <div className="space-y-3">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/assets/${rel.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        {categoryIcon(rel.category)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                          {rel.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {rel.file_name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
