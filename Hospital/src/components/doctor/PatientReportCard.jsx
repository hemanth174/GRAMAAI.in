import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  File,
  FileText,
  Image,
  Sparkles,
} from "lucide-react";

const FILE_META = {
  pdf: {
    icon: FileText,
    badgeClass: "bg-red-100 text-red-700",
    label: "PDF Document",
  },
  image: {
    icon: Image,
    badgeClass: "bg-blue-100 text-blue-700",
    label: "Image",
  },
  default: {
    icon: File,
    badgeClass: "bg-slate-100 text-slate-600",
    label: "File",
  },
};

const REVIEW_STATUS_META = {
  pending: {
    label: "Awaiting review",
    badgeClass: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  reviewed: {
    label: "Reviewed",
    badgeClass: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
};

function formatTimestamp(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function PatientReportCard({
  report,
  summary,
  onSummarize,
  onMarkReviewed,
  isSummarizing,
  isReviewing,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const fileMeta = useMemo(() => {
    return FILE_META[report.file_type] || FILE_META.default;
  }, [report.file_type]);

  const reviewStatusMeta = REVIEW_STATUS_META[report.review_status || "pending"];

  const FileIcon = fileMeta.icon;
  const ReviewIcon = reviewStatusMeta.icon;

  const handleMarkReviewed = async () => {
    if (report.review_status === "reviewed") {
      return;
    }

    const result = await onMarkReviewed(report);
    if (result) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1600);
    }
  };

  const handleSummarize = () => {
    onSummarize(report);
  };

  return (
    <Card className="relative overflow-hidden border border-slate-200/80 bg-white/80 dark:border-slate-800/60 dark:bg-slate-900/60">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-6 py-4 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-200 to-cyan-200 text-blue-700">
              <FileIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {report.patient_name}
                </p>
                <Badge className={fileMeta.badgeClass}>{fileMeta.label}</Badge>
                <Badge className={reviewStatusMeta.badgeClass}>
                  <ReviewIcon className="mr-1 h-3.5 w-3.5" />
                  {reviewStatusMeta.label}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Uploaded {formatTimestamp(report.uploaded_at)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {report.file_name}
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-slate-400 transition-transform duration-300",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CardContent className="space-y-4 px-6 pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Clock className="h-4 w-4" />
                  Uploaded {formatTimestamp(report.uploaded_at)}
                </span>
                {report.reviewed_at && (
                  <span className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" /> Reviewed {formatTimestamp(report.reviewed_at)}
                  </span>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 dark:border-slate-800/60 dark:bg-slate-900/70">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    AI Report Summary
                  </p>
                </div>
                <div className="mt-3 rounded-xl bg-slate-50/80 p-4 text-sm text-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
                  {summary ? (
                    summary
                  ) : isSummarizing ? (
                    "Generating summary..."
                  ) : (
                    "No summary available yet. Generate one to view key findings."
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="border border-slate-200/80 bg-white/70 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                >
                  <a href={report.download_url} target="_blank" rel="noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Download Report
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isSummarizing ? "Summarizing..." : "Generate Summary"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkReviewed}
                  disabled={isReviewing || report.review_status === "reviewed"}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  {report.review_status === "reviewed" ? "Reviewed" : "Mark as Reviewed"}
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            key="celebration"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-200/60 to-emerald-200/60"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-2 rounded-full bg-white/90 px-6 py-3 text-sm font-medium text-green-700 shadow-lg"
            >
              <CheckCircle className="h-5 w-5" />
              Marked as reviewed
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {report.review_status !== "reviewed" && (
        <div className="absolute right-4 top-4 flex items-center gap-1 text-xs font-medium text-amber-600">
          <AlertCircle className="h-3.5 w-3.5" /> Needs attention
        </div>
      )}
    </Card>
  );
}
