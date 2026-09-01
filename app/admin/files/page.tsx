"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  FileText, 
  KeyRound, 
  BarChart3, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  ShieldAlert, 
  ExternalLink, 
  Clock, 
  Eye, 
  Lock, 
  Unlock,
  RefreshCw,
  UploadCloud,
  FileUp,
  X
} from "lucide-react";

interface FileRecord {
  id: string;
  slug: string;
  target_key: string;
  content_type: string;
  is_public: number;
  cache_control: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface FileAccessToken {
  token: string;
  file_slug: string;
  recipient_label: string | null;
  max_uses: number | null;
  use_count: number;
  expires_at: string;
  is_revoked: number;
  created_at: string;
}

interface FileAccessLog {
  id: number;
  file_slug: string;
  token_used: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  referer: string | null;
  accessed_at: string;
}

interface AccessStats {
  totalRequests: number;
  uniqueFilesCount: number;
  topFiles: { file_slug: string; count: number }[];
  recentLogs: FileAccessLog[];
}

export default function AdminFilesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"files" | "tokens" | "analytics">("files");

  const [files, setFiles] = useState<FileRecord[]>([]);
  const [tokens, setTokens] = useState<FileAccessToken[]>([]);
  const [stats, setStats] = useState<AccessStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Upload state
  const [uploadMode, setUploadMode] = useState<"upload" | "manual">("upload");
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadSlug, setUploadSlug] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadPublic, setUploadPublic] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Alias state
  const [manualSlug, setManualSlug] = useState("");
  const [manualTarget, setManualTarget] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const [manualPublic, setManualPublic] = useState(true);

  // New token form
  const [selectedFileSlug, setSelectedFileSlug] = useState("");
  const [recipientLabel, setRecipientLabel] = useState("");
  const [expiresInHours, setExpiresInHours] = useState("168"); // 7 days
  const [maxUses, setMaxUses] = useState("");
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/files");
      if (res.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        setTokens(data.tokens || []);
        setStats(data.stats || null);
        setIsAuthenticated(true);
        if (data.files?.length > 0 && !selectedFileSlug) {
          setSelectedFileSlug(data.files[0].slug);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedFileSlug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError("Invalid password. Check your ADMIN_PASSWORD setting in .env");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setLoginError(error.message || "Failed to login");
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedUploadFile(file);
    // Auto-generate clean slug from filename
    const cleanName = file.name.toLowerCase().replace(/\s+/g, "-");
    setUploadSlug(cleanName);
    setUploadDesc(`Uploaded ${file.name}`);
    setUploadStatusMsg(null);
  };

  const handleDirectUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUploadFile || !uploadSlug) return;

    setIsUploading(true);
    setUploadStatusMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedUploadFile);
      formData.append("slug", uploadSlug.trim());
      formData.append("description", uploadDesc.trim());
      formData.append("is_public", uploadPublic ? "true" : "false");

      const res = await fetch("/api/admin/files", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadStatusMsg(`✅ ${data.message || "File uploaded successfully!"}`);
        setSelectedUploadFile(null);
        setUploadSlug("");
        setUploadDesc("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchData();
      } else {
        const errData = await res.json();
        setUploadStatusMsg(`❌ Upload failed: ${errData.error || "Server error"}`);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setUploadStatusMsg(`❌ Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualUpsert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSlug || !manualTarget) return;

    try {
      const res = await fetch("/api/admin/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert_file",
          slug: manualSlug.trim(),
          target_key: manualTarget.trim(),
          is_public: manualPublic,
          description: manualDesc.trim(),
        }),
      });
      if (res.ok) {
        setManualSlug("");
        setManualTarget("");
        setManualDesc("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFile = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete alias "${slug}"?`)) return;
    try {
      const res = await fetch("/api/admin/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_file", slug }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileSlug) return;

    try {
      const res = await fetch("/api/admin/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_token",
          file_slug: selectedFileSlug,
          recipient_label: recipientLabel.trim(),
          expires_in_hours: parseInt(expiresInHours, 10),
          max_uses: maxUses ? parseInt(maxUses, 10) : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const origin = window.location.origin;
        const link = `${origin}/private/${selectedFileSlug}?token=${data.token.token}`;
        setCreatedLink(link);
        setRecipientLabel("");
        setMaxUses("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevokeToken = async (token: string) => {
    if (!confirm("Are you sure you want to revoke this access token immediately?")) return;
    try {
      const res = await fetch("/api/admin/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke_token", token }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 text-[var(--ink)]">
        <p className="text-sm font-mono flex items-center gap-2">
          <RefreshCw className="animate-spin w-4 h-4" /> Authenticating...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[var(--white)] border border-[var(--line-strong)] p-8 shadow-xl">
          <div className="mb-6">
            <p className="kicker mb-1 font-mono text-xs uppercase tracking-widest text-[var(--cobalt)]">
              Admin Access
            </p>
            <h1 className="text-2xl font-serif text-[var(--ink)]">Personal File Manager</h1>
            <p className="text-sm text-[var(--ink-soft)] mt-1">
              Enter your admin passphrase to upload files, configure aliases, and generate shareable links.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--ink-soft)] mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-3 py-2 border border-[var(--line-strong)] bg-white text-[var(--ink)] font-mono text-sm focus:outline-none focus:border-[var(--cobalt)]"
                autoFocus
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--ink)] text-white text-sm font-mono uppercase tracking-wider hover:bg-[var(--cobalt)] transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto text-[var(--ink)]">
      {/* Header */}
      <header className="mb-10 pb-6 border-b border-[var(--line)] flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker mb-1 font-mono text-xs uppercase tracking-widest text-[var(--cobalt)]">
            Infrastructure & Control
          </p>
          <h1 className="text-3xl md:text-4xl font-serif">File Server Manager</h1>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            Direct file uploads, Cloudflare R2 routing, dynamic aliases, recruiter tokens, and access telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--line)] bg-[var(--white)] text-xs font-mono hover:border-[var(--ink)] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <a
            href="/resume"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--line)] bg-[var(--white)] text-xs font-mono hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors"
          >
            View /resume <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[var(--line)] mb-8 space-x-1">
        <button
          onClick={() => setActiveTab("files")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-mono border-b-2 transition-colors ${
            activeTab === "files"
              ? "border-[var(--cobalt)] text-[var(--cobalt)] font-semibold bg-[var(--white)]"
              : "border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]"
          }`}
        >
          <FileText className="w-4 h-4" /> Files & Uploads ({files.length})
        </button>
        <button
          onClick={() => setActiveTab("tokens")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-mono border-b-2 transition-colors ${
            activeTab === "tokens"
              ? "border-[var(--cobalt)] text-[var(--cobalt)] font-semibold bg-[var(--white)]"
              : "border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]"
          }`}
        >
          <KeyRound className="w-4 h-4" /> Signed Tokens ({tokens.length})
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-mono border-b-2 transition-colors ${
            activeTab === "analytics"
              ? "border-[var(--cobalt)] text-[var(--cobalt)] font-semibold bg-[var(--white)]"
              : "border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]"
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Analytics & Logs ({stats?.totalRequests ?? 0})
        </button>
      </div>

      {/* TAB 1: FILES & UPLOAD */}
      {activeTab === "files" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Upload / Add Form */}
          <div className="bg-[var(--white)] border border-[var(--line)] p-6 self-start space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <span className="text-sm font-serif font-semibold">Add / Upload File</span>
              <div className="flex bg-[var(--paper)] p-0.5 rounded text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setUploadMode("upload")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    uploadMode === "upload" ? "bg-white text-[var(--cobalt)] shadow-xs font-bold" : "text-[var(--ink-soft)]"
                  }`}
                >
                  Direct Upload
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("manual")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    uploadMode === "manual" ? "bg-white text-[var(--cobalt)] shadow-xs font-bold" : "text-[var(--ink-soft)]"
                  }`}
                >
                  Manual Alias
                </button>
              </div>
            </div>

            {/* DIRECT UPLOAD FORM */}
            {uploadMode === "upload" ? (
              <form onSubmit={handleDirectUpload} className="space-y-4 text-xs font-mono">
                {/* Drag and Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileSelect(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                    selectedUploadFile
                      ? "border-emerald-500 bg-emerald-50/40"
                      : "border-[var(--line-strong)] hover:border-[var(--cobalt)] bg-[var(--paper)]"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  {selectedUploadFile ? (
                    <div className="space-y-1">
                      <FileUp className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                      <p className="font-bold text-[var(--ink)] truncate max-w-xs mx-auto">
                        {selectedUploadFile.name}
                      </p>
                      <p className="text-[10px] text-[var(--ink-soft)]">
                        {(selectedUploadFile.size / 1024).toFixed(1)} KB · Click to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 text-[var(--ink-soft)]">
                      <UploadCloud className="w-7 h-7 mx-auto text-[var(--cobalt)] mb-1" />
                      <p className="font-semibold text-[var(--ink)]">Drag & drop your file here</p>
                      <p className="text-[10px]">or click to browse from computer (PDF, images, media)</p>
                    </div>
                  )}
                </div>

                {selectedUploadFile && (
                  <>
                    <div>
                      <label className="block text-[var(--ink-soft)] mb-1 uppercase">
                        Public URL Slug (Field 1)
                      </label>
                      <div className="flex items-center">
                        <span className="px-2 py-2 bg-[var(--paper)] border border-r-0 border-[var(--line)] text-[var(--ink-soft)]">
                          /f/
                        </span>
                        <input
                          type="text"
                          value={uploadSlug}
                          onChange={(e) => setUploadSlug(e.target.value)}
                          placeholder="e.g. resume.pdf"
                          className="w-full px-3 py-2 border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--cobalt)]"
                          required
                        />
                      </div>
                      <p className="text-[10px] text-[var(--ink-soft)] mt-1">
                        URL bersih yang akan dibagikan ke recruiter / publik.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[var(--ink-soft)] mb-1 uppercase">Description / Note</label>
                      <input
                        type="text"
                        value={uploadDesc}
                        onChange={(e) => setUploadDesc(e.target.value)}
                        placeholder="e.g. Latest Software Engineer Résumé"
                        className="w-full px-3 py-2 border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--cobalt)]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="upload_public"
                        checked={uploadPublic}
                        onChange={(e) => setUploadPublic(e.target.checked)}
                        className="rounded border-[var(--line)] text-[var(--cobalt)] focus:ring-[var(--cobalt)]"
                      />
                      <label htmlFor="upload_public" className="cursor-pointer text-[var(--ink)]">
                        Public file (direct /f/ access)
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full py-2.5 bg-[var(--cobalt)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[var(--ink)] transition-colors flex items-center justify-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading to Storage...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" /> Upload & Save File
                        </>
                      )}
                    </button>
                  </>
                )}

                {uploadStatusMsg && (
                  <div className="p-3 bg-[var(--paper)] border border-[var(--line)] text-[11px] font-mono">
                    {uploadStatusMsg}
                  </div>
                )}
              </form>
            ) : (
              /* MANUAL ALIAS FORM */
              <form onSubmit={handleManualUpsert} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-[var(--ink-soft)] mb-1 uppercase">Public URL Slug</label>
                  <div className="flex items-center">
                    <span className="px-2 py-2 bg-[var(--paper)] border border-r-0 border-[var(--line)] text-[var(--ink-soft)]">
                      /f/
                    </span>
                    <input
                      type="text"
                      value={manualSlug}
                      onChange={(e) => setManualSlug(e.target.value)}
                      placeholder="e.g. resume.pdf"
                      className="w-full px-3 py-2 border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--cobalt)]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--ink-soft)] mb-1 uppercase">
                    Target File Name in R2 / Local
                  </label>
                  <input
                    type="text"
                    value={manualTarget}
                    onChange={(e) => setManualTarget(e.target.value)}
                    placeholder="e.g. resume/Software-Engineer-EN.pdf"
                    className="w-full px-3 py-2 border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--cobalt)]"
                    required
                  />
                  <p className="text-[10px] text-[var(--ink-soft)] mt-1">
                    Nama file asli yang ada di folder public/ atau bucket Cloudflare R2.
                  </p>
                </div>

                <div>
                  <label className="block text-[var(--ink-soft)] mb-1 uppercase">Description</label>
                  <input
                    type="text"
                    value={manualDesc}
                    onChange={(e) => setManualDesc(e.target.value)}
                    placeholder="Brief version note"
                    className="w-full px-3 py-2 border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--cobalt)]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="manual_public"
                    checked={manualPublic}
                    onChange={(e) => setManualPublic(e.target.checked)}
                    className="rounded border-[var(--line)] text-[var(--cobalt)] focus:ring-[var(--cobalt)]"
                  />
                  <label htmlFor="manual_public" className="cursor-pointer text-[var(--ink)]">
                    Public file (direct /f/ access)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[var(--ink)] text-white text-xs uppercase tracking-wider hover:bg-[var(--cobalt)] transition-colors mt-2"
                >
                  Save Alias Route
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Files List Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[var(--white)] border border-[var(--line)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[var(--paper-deep)] border-b border-[var(--line)] text-[var(--ink-soft)] uppercase">
                    <tr>
                      <th className="p-3">Route / Alias</th>
                      <th className="p-3">Target Object Key</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {files.map((file) => (
                      <tr key={file.id} className="hover:bg-[var(--paper)] transition-colors">
                        <td className="p-3 font-semibold">
                          <div className="flex items-center gap-1.5">
                            {file.is_public ? (
                              <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <a
                              href={`/f/${file.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[var(--cobalt)] hover:underline flex items-center gap-1"
                            >
                              /f/{file.slug}
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          </div>
                          {file.description && (
                            <p className="text-[11px] text-[var(--ink-soft)] font-normal mt-0.5">
                              {file.description}
                            </p>
                          )}
                        </td>
                        <td className="p-3 text-[var(--ink-soft)] break-all">{file.target_key}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              file.is_public
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {file.is_public ? "Public" : "Private"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const url = `${window.location.origin}/f/${file.slug}`;
                                copyToClipboard(url, file.id);
                              }}
                              title="Copy URL"
                              className="p-1 hover:text-[var(--cobalt)] transition-colors"
                            >
                              {copiedToken === file.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file.slug)}
                              title="Delete Alias"
                              className="p-1 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIGNED TOKENS */}
      {activeTab === "tokens" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-[var(--white)] border border-[var(--line)] p-6 self-start">
            <h2 className="text-lg font-serif mb-4 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[var(--cobalt)]" /> Generate Shareable Link
            </h2>
            <form onSubmit={handleCreateToken} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[var(--ink-soft)] mb-1 uppercase">Target File</label>
                <select
                  value={selectedFileSlug}
                  onChange={(e) => setSelectedFileSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--cobalt)]"
                  required
                >
                  {files.map((file) => (
                    <option key={file.id} value={file.slug}>
                      {file.slug} ({file.description || file.target_key})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[var(--ink-soft)] mb-1 uppercase">Recipient / HR Note</label>
                <input
                  type="text"
                  value={recipientLabel}
                  onChange={(e) => setRecipientLabel(e.target.value)}
                  placeholder="e.g. Google Recruiter, Client X"
                  className="w-full px-3 py-2 border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--cobalt)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--ink-soft)] mb-1 uppercase">Expiry Period</label>
                  <select
                    value={expiresInHours}
                    onChange={(e) => setExpiresInHours(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--cobalt)]"
                  >
                    <option value="24">24 Hours</option>
                    <option value="72">3 Days</option>
                    <option value="168">7 Days</option>
                    <option value="720">30 Days</option>
                    <option value="8760">1 Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--ink-soft)] mb-1 uppercase">Max Downloads</label>
                  <input
                    type="number"
                    min="1"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    placeholder="∞ Unlimited"
                    className="w-full px-3 py-2 border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--cobalt)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[var(--cobalt)] text-white text-xs uppercase tracking-wider hover:bg-[var(--ink)] transition-colors mt-2"
              >
                Generate Token Link
              </button>
            </form>

            {createdLink && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-300">
                <p className="text-[11px] font-mono font-bold text-emerald-900 mb-1 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Generated Shareable URL:
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    readOnly
                    value={createdLink}
                    className="w-full p-1.5 text-[11px] font-mono bg-white border border-emerald-300 text-emerald-950 select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(createdLink, "created")}
                    className="px-3 py-1.5 bg-emerald-700 text-white text-[11px] font-mono hover:bg-emerald-800 transition-colors shrink-0"
                  >
                    {copiedToken === "created" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[var(--white)] border border-[var(--line)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[var(--paper-deep)] border-b border-[var(--line)] text-[var(--ink-soft)] uppercase">
                    <tr>
                      <th className="p-3">Recipient & File</th>
                      <th className="p-3">Usage</th>
                      <th className="p-3">Expires</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {tokens.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-[var(--ink-soft)]">
                          No access tokens created yet.
                        </td>
                      </tr>
                    )}
                    {tokens.map((t) => {
                      const isExpired = new Date() > new Date(t.expires_at);
                      const isExhausted = t.max_uses !== null && t.use_count >= t.max_uses;
                      const isRevoked = t.is_revoked === 1;
                      const link = `${typeof window !== "undefined" ? window.location.origin : ""}/private/${t.file_slug}?token=${t.token}`;

                      let statusBadge = (
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      );
                      if (isRevoked) {
                        statusBadge = (
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-100 text-red-800">
                            Revoked
                          </span>
                        );
                      } else if (isExpired) {
                        statusBadge = (
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-gray-100 text-gray-800">
                            Expired
                          </span>
                        );
                      } else if (isExhausted) {
                        statusBadge = (
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-100 text-amber-800">
                            Limit Met
                          </span>
                        );
                      }

                      return (
                        <tr key={t.token} className="hover:bg-[var(--paper)] transition-colors">
                          <td className="p-3">
                            <p className="font-semibold text-[var(--ink)]">
                              {t.recipient_label || "General Link"}
                            </p>
                            <p className="text-[11px] text-[var(--cobalt)]">/private/{t.file_slug}</p>
                            <p className="text-[10px] text-[var(--ink-soft)] font-mono truncate max-w-xs">
                              Key: {t.token.slice(0, 12)}...
                            </p>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-[var(--ink)]">{t.use_count}</span>
                            <span className="text-[var(--ink-soft)]">
                              {" "}
                              / {t.max_uses ? t.max_uses : "∞"}
                            </span>
                          </td>
                          <td className="p-3 text-[var(--ink-soft)]">
                            {new Date(t.expires_at).toLocaleDateString()}
                          </td>
                          <td className="p-3">{statusBadge}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => copyToClipboard(link, t.token)}
                                title="Copy Signed Link"
                                className="p-1 hover:text-[var(--cobalt)] transition-colors"
                              >
                                {copiedToken === t.token ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              {!isRevoked && (
                                <button
                                  onClick={() => handleRevokeToken(t.token)}
                                  title="Revoke Token"
                                  className="p-1 hover:text-red-600 transition-colors"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS */}
      {activeTab === "analytics" && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[var(--white)] border border-[var(--line)] p-6">
              <p className="kicker text-[11px] font-mono text-[var(--ink-soft)] uppercase">
                Total File Requests
              </p>
              <h3 className="text-3xl font-serif text-[var(--cobalt)] mt-2 font-bold">
                {stats.totalRequests}
              </h3>
            </div>
            <div className="bg-[var(--white)] border border-[var(--line)] p-6">
              <p className="kicker text-[11px] font-mono text-[var(--ink-soft)] uppercase">
                Unique Files Accessed
              </p>
              <h3 className="text-3xl font-serif text-[var(--brass)] mt-2 font-bold">
                {stats.uniqueFilesCount}
              </h3>
            </div>
            <div className="bg-[var(--white)] border border-[var(--line)] p-6">
              <p className="kicker text-[11px] font-mono text-[var(--ink-soft)] uppercase">
                Active Private Tokens
              </p>
              <h3 className="text-3xl font-serif text-emerald-600 mt-2 font-bold">
                {tokens.filter((t) => t.is_revoked === 0 && new Date() < new Date(t.expires_at)).length}
              </h3>
            </div>
          </div>

          <div className="bg-[var(--white)] border border-[var(--line)] p-6">
            <h3 className="text-lg font-serif mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[var(--cobalt)]" /> Top Accessed Files
            </h3>
            {stats.topFiles.length === 0 ? (
              <p className="text-xs font-mono text-[var(--ink-soft)]">No file requests logged yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.topFiles.map((top) => {
                  const maxCount = Math.max(...stats.topFiles.map((f) => f.count), 1);
                  const percentage = Math.round((top.count / maxCount) * 100);
                  return (
                    <div key={top.file_slug} className="text-xs font-mono">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-[var(--ink)]">/f/{top.file_slug}</span>
                        <span className="text-[var(--ink-soft)]">{top.count} requests</span>
                      </div>
                      <div className="w-full bg-[var(--paper-deep)] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[var(--cobalt)] h-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-[var(--white)] border border-[var(--line)] overflow-hidden">
            <div className="p-4 border-b border-[var(--line)] bg-[var(--paper-deep)]">
              <h3 className="text-sm font-serif flex items-center gap-2 text-[var(--ink)]">
                <Clock className="w-4 h-4 text-[var(--cobalt)]" /> Recent Access Audit Log (Last 50)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[var(--paper)] border-b border-[var(--line)] text-[var(--ink-soft)] uppercase">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">File Slug</th>
                    <th className="p-3">Token Used</th>
                    <th className="p-3">Client UA</th>
                    <th className="p-3">IP Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {stats.recentLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-[var(--ink-soft)]">
                        No access logs recorded yet.
                      </td>
                    </tr>
                  )}
                  {stats.recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[var(--paper)] transition-colors">
                      <td className="p-3 text-[var(--ink-soft)] whitespace-nowrap">
                        {new Date(log.accessed_at).toLocaleString()}
                      </td>
                      <td className="p-3 font-semibold text-[var(--cobalt)]">{log.file_slug}</td>
                      <td className="p-3 text-[var(--ink-soft)]">
                        {log.token_used ? (
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
                            {log.token_used.slice(0, 8)}...
                          </span>
                        ) : (
                          <span className="text-gray-400">Direct / Public</span>
                        )}
                      </td>
                      <td className="p-3 text-[var(--ink-soft)] max-w-xs truncate" title={log.user_agent || ""}>
                        {log.user_agent || "Unknown"}
                      </td>
                      <td className="p-3 text-[var(--ink-soft)] font-mono">{log.ip_hash || "Anonymized"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
