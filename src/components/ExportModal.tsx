/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BLUEPRINT_SECTIONS, CANON_FILMS, CANON_SERIES, SPECIALIST_AGENTS } from '../data/blueprintData';
import { X, Copy, Check, Download, FileText, Code2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# UNIFIED 50-YEAR MARS CIVILIZATION BLUEPRINT & DETERMINISTIC MULTI-AGENT KERNEL\n`;
    md += `**Specification Version:** Argon 4.0 · **Target Tokens:** 1,000,000 · **Areocentric Epoch:** Y01–Y50\n\n`;

    md += `## 1. SPECIALIST AGENT TAXONOMY\n\n`;
    SPECIALIST_AGENTS.forEach((a) => {
      md += `### ${a.id}: ${a.name} (${a.daemon})\n`;
      md += `- **Compute Tier:** ${a.tier}\n`;
      md += `- **Epistemic Lens:** ${a.epistemicLens}\n`;
      md += `- **Mandate:** ${a.mandate}\n\n`;
    });

    md += `## 2. THE 7-MODULE BLUEPRINT MATRIX\n\n`;
    BLUEPRINT_SECTIONS.forEach((s) => {
      md += `### [${s.id}] ${s.moduleId}: ${s.title}\n`;
      md += `${s.summary}\n\n`;
      if (s.subsections) {
        s.subsections.forEach((sub) => {
          md += `- **[${sub.id}]**: ${sub.title} — ${sub.summary}\n`;
        });
        md += `\n`;
      }
    });

    md += `## 3. CINEMATIC CANON (12 FILMS & 3 PRESTIGE SERIES)\n\n`;
    CANON_FILMS.forEach((f) => {
      md += `### ${f.id}: ${f.title} (${f.epoch})\n`;
      md += `- **Timeline:** ${f.solsTimeline}\n`;
      md += `- **Logline:** ${f.logline}\n`;
      md += `- **Camera Language:** ${f.cameraLanguage}\n`;
      md += `- **Soundtrack Motif:** ${f.soundtrackMotif}\n\n`;
    });

    return md;
  };

  const generateJson = () => {
    return JSON.stringify(
      {
        blueprintMeta: {
          title: 'Unified 50-Year Mars Civilization Blueprint',
          version: 'Argon 4.0',
          horizon: '50 Martian Sols / 5 Epochs',
          contextWindow: '1M Tokens',
        },
        agents: SPECIALIST_AGENTS,
        modules: BLUEPRINT_SECTIONS,
        cinematicCanon: {
          films: CANON_FILMS,
          series: CANON_SERIES,
        },
      },
      null,
      2
    );
  };

  const exportText = format === 'markdown' ? generateMarkdown() : generateJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportText], {
      type: format === 'markdown' ? 'text/markdown' : 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mars_civilization_blueprint.${format === 'markdown' ? 'md' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Download className="w-5 h-5 text-amber-500" />
              <span>Export Mars Civilization Blueprint Specification</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Full canonical schema including Kernel, Planetary Sim, Emotional Twins, and Canon
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('markdown')}
              className={`px-3 py-1.5 text-xs font-mono rounded flex items-center gap-1.5 transition-colors ${
                format === 'markdown'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown (.md)</span>
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`px-3 py-1.5 text-xs font-mono rounded flex items-center gap-1.5 transition-colors ${
                format === 'json'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>JSON (.json)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content Preview */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950">
          <pre className="whitespace-pre-wrap leading-relaxed">{exportText}</pre>
        </div>
      </div>
    </div>
  );
};
