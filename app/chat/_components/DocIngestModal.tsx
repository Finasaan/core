"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, Shield, Receipt, CheckCircle2, AlertCircle, UploadCloud } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

// ── Types ────────────────────────────────────────────────────────────────────

type DocCategory = "psx" | "insurance" | "tax";

interface IngestStats {
  filename: string;
  company?: string;
  period?: string;
  doc_type?: string;
  total_pages: number;
  scanned: boolean;
  vision_pages_processed: number;
  prose_chunks_stored: number;
  tables_extracted: number;
  skipped?: boolean;
}

interface DocIngestModalProps {
  open: boolean;
  onClose: () => void;
}

// ── Phase messages cycle during upload ───────────────────────────────────────

const PHASE_MESSAGES = [
  "Uploading file…",
  "Extracting text from pages…",
  "Classifying page types…",
  "Processing table-heavy pages via vision…",
  "Generating embeddings…",
  "Storing chunks & tables…",
  "Almost done…",
];

// ── Doc type options ─────────────────────────────────────────────────────────

const PSX_DOC_TYPES = [
  { value: "annual_report", label: "Annual Report" },
  { value: "quarterly_report", label: "Quarterly Report" },
  { value: "financial_statements", label: "Financial Statements" },
  { value: "prospectus", label: "Prospectus" },
  { value: "other", label: "Other" },
];

const INSURANCE_DOC_TYPES = [
  { value: "policy_document", label: "Policy Document" },
  { value: "rate_schedule", label: "Rate Schedule" },
  { value: "claims_manual", label: "Claims Manual" },
  { value: "product_brochure", label: "Product Brochure" },
  { value: "other", label: "Other" },
];

const TAX_DOC_TYPES = [
  { value: "guidelines", label: "Guidelines" },
  { value: "ordinance", label: "Ordinance / Act" },
  { value: "circular", label: "SRO / Circular" },
  { value: "forms", label: "Forms" },
  { value: "other", label: "Other" },
];

// ── Component ────────────────────────────────────────────────────────────────

export function DocIngestModal({ open, onClose }: DocIngestModalProps) {
  const [category, setCategory] = useState<DocCategory | null>(null);

  // Metadata fields
  const [company, setCompany] = useState("");
  const [period, setPeriod] = useState("");
  const [docType, setDocType] = useState("");
  const [policyName, setPolicyName] = useState("");
  const [sourceName, setSourceName] = useState("");

  // File + upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState<IngestStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setCategory(null);
        setCompany("");
        setPeriod("");
        setDocType("");
        setPolicyName("");
        setSourceName("");
        setFile(null);
        setUploading(false);
        setPhaseIdx(0);
        setElapsed(0);
        setStats(null);
        setError(null);
      }, 300);
    }
  }, [open]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, []);

  const startTimers = useCallback(() => {
    setPhaseIdx(0);
    setElapsed(0);
    phaseTimerRef.current = setInterval(() => {
      setPhaseIdx((i) => Math.min(i + 1, PHASE_MESSAGES.length - 1));
    }, 4000);
    elapsedTimerRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);
  }, []);

  const stopTimers = useCallback(() => {
    if (phaseTimerRef.current) { clearInterval(phaseTimerRef.current); phaseTimerRef.current = null; }
    if (elapsedTimerRef.current) { clearInterval(elapsedTimerRef.current); elapsedTimerRef.current = null; }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
    e.target.value = "";
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file || !category) return;

    setUploading(true);
    setError(null);
    setStats(null);
    startTimers();

    const form = new FormData();
    form.append("file", file);

    if (category === "psx") {
      form.append("domain", "financials");
      if (company) form.append("company", company);
      if (period) form.append("period", period);
      if (docType) form.append("doc_type", docType);
    } else if (category === "insurance") {
      form.append("domain", "insurance");
      if (company) form.append("company", company);
      if (policyName) form.append("policy_name", policyName);
      if (docType) form.append("doc_type", docType);
    } else {
      form.append("domain", "tax");
      if (sourceName) form.append("source_name", sourceName);
      if (docType) form.append("doc_type", docType);
    }

    try {
      const res = await fetch(`${API_BASE}/api/chatbot/documents/upload`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
        statistics?: IngestStats;
        skipped?: boolean;
      };

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? data.message ?? `Upload failed (${res.status})`);
      }

      setStats(data.statistics ? { ...data.statistics, skipped: data.skipped } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      stopTimers();
      setUploading(false);
    }
  }, [file, category, company, period, docType, policyName, sourceName, startTimers, stopTimers]);

  if (!open) return null;

  const docTypeOptions =
    category === "psx" ? PSX_DOC_TYPES :
    category === "insurance" ? INSURANCE_DOC_TYPES :
    TAX_DOC_TYPES;

  const isReady = !!file && !uploading && !!category;

  return (
    <div className="doc-ingest-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="doc-ingest-modal">
        {/* Header */}
        <div className="doc-ingest-header">
          <div className="doc-ingest-header__left">
            <UploadCloud size={16} className="doc-ingest-header__icon" />
            <span className="doc-ingest-header__title">Ingest Document</span>
          </div>
          <button className="doc-ingest-close" onClick={onClose} disabled={uploading}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="doc-ingest-body">

          {/* Step 1: Category */}
          <div className="doc-ingest-section">
            <p className="doc-ingest-label">Document type</p>
            <div className="doc-ingest-categories">
              <button
                className={`doc-ingest-cat ${category === "psx" ? "active" : ""}`}
                onClick={() => { setCategory("psx"); setDocType(""); }}
                disabled={uploading}
              >
                <FileText size={15} />
                <span>PSX Financial</span>
              </button>
              <button
                className={`doc-ingest-cat ${category === "insurance" ? "active" : ""}`}
                onClick={() => { setCategory("insurance"); setDocType(""); }}
                disabled={uploading}
              >
                <Shield size={15} />
                <span>Insurance</span>
              </button>
              <button
                className={`doc-ingest-cat ${category === "tax" ? "active" : ""}`}
                onClick={() => { setCategory("tax"); setDocType(""); }}
                disabled={uploading}
              >
                <Receipt size={15} />
                <span>Tax Document</span>
              </button>
            </div>
          </div>

          {/* Step 2: Metadata — shown once category is selected */}
          {category && (
            <div className="doc-ingest-section">
              <p className="doc-ingest-label">Metadata</p>
              <div className="doc-ingest-fields">

                {/* PSX fields */}
                {category === "psx" && (
                  <>
                    <input
                      className="doc-ingest-input"
                      placeholder="Company name (e.g. Engro Corporation)"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={uploading}
                    />
                    <input
                      className="doc-ingest-input"
                      placeholder="Fiscal period (e.g. FY2024, Q3 2024)"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      disabled={uploading}
                    />
                  </>
                )}

                {/* Insurance fields */}
                {category === "insurance" && (
                  <>
                    <input
                      className="doc-ingest-input"
                      placeholder="Company name (e.g. Jubilee Life Insurance)"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={uploading}
                    />
                    <input
                      className="doc-ingest-input"
                      placeholder="Policy name (e.g. MyHealth Family Plan)"
                      value={policyName}
                      onChange={(e) => setPolicyName(e.target.value)}
                      disabled={uploading}
                    />
                  </>
                )}

                {/* Tax fields */}
                {category === "tax" && (
                  <input
                    className="doc-ingest-input"
                    placeholder="Source name (e.g. FBR Income Tax Ordinance 2001)"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    disabled={uploading}
                  />
                )}

                {/* Doc type — shared across all categories */}
                <select
                  className="doc-ingest-select"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  disabled={uploading}
                >
                  <option value="">Document sub-type (optional)</option>
                  {docTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: File picker */}
          {category && (
            <div className="doc-ingest-section">
              <p className="doc-ingest-label">PDF file</p>
              <div className="doc-ingest-file-row">
                <button
                  className="doc-ingest-file-btn"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  <FileText size={13} />
                  {file ? file.name : "Choose PDF…"}
                </button>
                {file && (
                  <span className="doc-ingest-file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="doc-ingest-progress">
              <div className="doc-ingest-progress__bar">
                <div className="doc-ingest-progress__fill" />
              </div>
              <div className="doc-ingest-progress__row">
                <span className="doc-ingest-progress__phase">{PHASE_MESSAGES[phaseIdx]}</span>
                <span className="doc-ingest-progress__elapsed">{elapsed}s</span>
              </div>
            </div>
          )}

          {/* Success */}
          {stats && !uploading && (
            <div className="doc-ingest-result doc-ingest-result--success">
              <div className="doc-ingest-result__header">
                <CheckCircle2 size={15} />
                <span>{stats.skipped ? "Already ingested (duplicate)" : "Ingested successfully"}</span>
              </div>
              {!stats.skipped && (
                <div className="doc-ingest-result__stats">
                  <div className="doc-ingest-stat">
                    <span className="doc-ingest-stat__label">Pages</span>
                    <span className="doc-ingest-stat__value">{stats.total_pages}</span>
                  </div>
                  <div className="doc-ingest-stat">
                    <span className="doc-ingest-stat__label">Scanned</span>
                    <span className="doc-ingest-stat__value">{stats.scanned ? "Yes" : "No"}</span>
                  </div>
                  <div className="doc-ingest-stat">
                    <span className="doc-ingest-stat__label">Vision pages</span>
                    <span className="doc-ingest-stat__value">{stats.vision_pages_processed}</span>
                  </div>
                  <div className="doc-ingest-stat">
                    <span className="doc-ingest-stat__label">Prose chunks</span>
                    <span className="doc-ingest-stat__value">{stats.prose_chunks_stored}</span>
                  </div>
                  <div className="doc-ingest-stat">
                    <span className="doc-ingest-stat__label">Tables</span>
                    <span className="doc-ingest-stat__value">{stats.tables_extracted}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && !uploading && (
            <div className="doc-ingest-result doc-ingest-result--error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="doc-ingest-footer">
          {stats ? (
            <Button
              className="doc-ingest-footer__btn doc-ingest-footer__btn--primary"
              onClick={onClose}
            >
              Done
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="doc-ingest-footer__btn"
                onClick={onClose}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                className="doc-ingest-footer__btn doc-ingest-footer__btn--primary"
                onClick={handleUpload}
                disabled={!isReady}
              >
                {uploading ? "Ingesting…" : "Ingest Document"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
