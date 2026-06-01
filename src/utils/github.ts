// src/utils/github.ts
// GitHub API utility for live asset fetching

export interface GitHubFileInfo {
  name: string;
  path: string;
  size: number;
  downloadUrl: string;
  content: string;
  type: "file" | "dir";
  htmlUrl: string;
}

export interface GitHubDirEntry {
  name: string;
  path: string;
  type: "file" | "dir";
  size: number;
  download_url: string | null;
  html_url: string;
}

/**
 * Parses a GitHub blob or tree URL into its components.
 * Supports:
 *   https://github.com/owner/repo/blob/branch/path/to/file.cs  (file)
 *   https://github.com/owner/repo/tree/branch/path/to/folder   (folder)
 *   https://github.com/owner/repo/tree/branch                  (repo root)
 *   https://github.com/owner/repo                              (repo root, default branch)
 */
export function parseGitHubUrl(url: string): {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  type: "file" | "dir" | "unknown";
} | null {
  if (!url) return null;
  try {
    const cleaned = url.trim().replace(/\/$/, "");

    // Match file or folder with explicit path: /blob/branch/path or /tree/branch/path
    const fullMatch = cleaned.match(
      /github\.com\/([^/]+)\/([^/]+)\/(blob|tree|raw)\/([^/]+)\/(.*)/
    );
    if (fullMatch) {
      const [, owner, repo, refType, branch, path] = fullMatch;
      return {
        owner,
        repo,
        branch,
        path,
        type: refType === "tree" ? "dir" : "file",
      };
    }

    // Match repo root with branch: /tree/branch (no subpath)
    const branchOnlyMatch = cleaned.match(
      /github\.com\/([^/]+)\/([^/]+)\/(tree|blob)\/([^/]+)$/
    );
    if (branchOnlyMatch) {
      const [, owner, repo, , branch] = branchOnlyMatch;
      return { owner, repo, branch, path: "", type: "dir" };
    }

    // Match bare repo URL: github.com/owner/repo
    const repoOnlyMatch = cleaned.match(/github\.com\/([^/]+)\/([^/]+)$/);
    if (repoOnlyMatch) {
      const [, owner, repo] = repoOnlyMatch;
      return { owner, repo, branch: "main", path: "", type: "dir" };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the HTML URL for the GitHub repo or file (for the "View on GitHub" button).
 * For folder assets this is the repo page; for files it is the blob URL.
 */
export function getRepoHtmlUrl(githubUrl: string): string {
  // Strip to repo root: everything up to and including /owner/repo
  const match = githubUrl.match(/https:\/\/github\.com\/[^/]+\/[^/]+/);
  return match ? match[0] : githubUrl;
}

/**
 * Converts a GitHub blob URL to a raw content URL.
 * https://github.com/owner/repo/blob/main/file.cs
 * → https://raw.githubusercontent.com/owner/repo/main/file.cs
 */
export function getRawUrl(githubUrl: string): string {
  return githubUrl
    .replace("github.com", "raw.githubusercontent.com")
    .replace("/blob/", "/");
}

/**
 * Fetches a single file's content and metadata from the GitHub Contents API.
 * Works for public repos without authentication (60 req/hr limit).
 */
export async function fetchFileContent(
  githubUrl: string
): Promise<GitHubFileInfo | null> {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed || parsed.type !== "file") return null;

  const apiUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/contents/${parsed.path}?ref=${parsed.branch}`;

  const res = await fetch(apiUrl, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return null;

  const data = await res.json();

  // Decode base64 content (GitHub API returns it base64 encoded)
  let content = "";
  if (data.content) {
    try {
      content = atob(data.content.replace(/\n/g, ""));
    } catch {
      content = "";
    }
  }

  return {
    name: data.name,
    path: data.path,
    size: data.size,
    downloadUrl: data.download_url,
    content,
    type: "file",
    htmlUrl: data.html_url,
  };
}

/**
 * Fetches the contents of a directory from the GitHub Contents API.
 */
export async function fetchFolderContents(
  githubUrl: string
): Promise<GitHubDirEntry[]> {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) return [];

  const apiUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/contents/${parsed.path}?ref=${parsed.branch}`;

  const res = await fetch(apiUrl, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return [];

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((item: Record<string, unknown>) => ({
    name: item.name as string,
    path: item.path as string,
    type: item.type as "file" | "dir",
    size: (item.size as number) || 0,
    download_url: (item.download_url as string) || null,
    html_url: item.html_url as string,
  }));
}

/**
 * Formats bytes into a human-readable file size.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Detects the programming language from a file extension.
 */
export function detectLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    cs: "csharp",
    js: "javascript",
    ts: "typescript",
    tsx: "typescript",
    jsx: "javascript",
    py: "python",
    glsl: "glsl",
    hlsl: "hlsl",
    shader: "glsl",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    md: "markdown",
    txt: "plaintext",
    html: "html",
    css: "css",
    cpp: "cpp",
    h: "cpp",
    c: "c",
  };
  return map[ext] || "plaintext";
}

/**
 * Determines if a GitHub URL is a zip file (direct download).
 */
export function isZipUrl(url: string): boolean {
  return url.toLowerCase().endsWith(".zip");
}
