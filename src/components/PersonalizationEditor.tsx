import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Download,
  Eye,
  FolderArchive,
  Image as ImageIcon,
  Music,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { BirthdayConfig } from '../types/birthday';
import { readFileAsDataUrl } from '../utils/storage';

type EditorTab = 'basics' | 'letter' | 'journey' | 'export';

interface PersonalizationEditorProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
  onChange: (next: BirthdayConfig) => void;
  onSave: () => Promise<void>;
  onReset: () => Promise<void>;
  onPreviewAsRecipient: () => void;
}

export function PersonalizationEditor({
  isOpen,
  onClose,
  config,
  onChange,
  onSave,
  onReset,
  onPreviewAsRecipient,
}: PersonalizationEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('basics');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [confirmReset, setConfirmReset] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    loading: 'static' | 'source' | null;
    error: string | null;
    success: string | null;
  }>({ loading: null, error: null, success: null });

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const updateField = <K extends keyof BirthdayConfig>(key: K, value: BirthdayConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const updateJourneyMessage = (index: number, value: string) => {
    const next = [...config.journeyMessages] as [string, string, string, string, string];
    next[index] = value;
    updateField('journeyMessages', next);
  };

  const updateGiftMessage = (index: number, value: string) => {
    const next = [...config.giftMessages] as [string, string, string];
    next[index] = value;
    updateField('giftMessages', next);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateField('photoDataUrl', dataUrl);
    } catch {
      setExportStatus({
        loading: null,
        error: 'Could not read that photo file. Please try a JPG or PNG image.',
        success: null,
      });
    }
    e.target.value = '';
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange({
        ...config,
        audioDataUrl: dataUrl,
        audioFileName: file.name,
      });
    } catch {
      setExportStatus({
        loading: null,
        error: 'Could not read that audio file. Please try an MP3 or M4A file.',
        success: null,
      });
    }
    e.target.value = '';
  };

  const handleSaveClick = async () => {
    setSaveState('saving');
    await onSave();
    setSaveState('saved');
    window.setTimeout(() => setSaveState('idle'), 2000);
  };

  const handleResetConfirm = async () => {
    await onReset();
    setConfirmReset(false);
  };

  const handleDownloadZip = async (mode: 'static' | 'source') => {
    setExportStatus({ loading: mode, error: null, success: null });
    try {
      await onSave();
      const endpoint = mode === 'static' ? '/api/export-zip' : '/api/export-source-zip';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Export failed');
      }

      const blob = await response.blob();
      const safeName = (config.recipientName || 'birthday')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const filename =
        mode === 'static'
          ? `${safeName || 'birthday'}-website-vercel-ready.zip`
          : `${safeName || 'birthday'}-github-source.zip`;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setExportStatus({
        loading: null,
        error: null,
        success:
          mode === 'static'
            ? 'Downloaded! Unzip it and deploy directly to Vercel.'
            : 'Downloaded! Push the folder to GitHub or import it in Vercel.',
      });
    } catch (err) {
      setExportStatus({
        loading: null,
        error:
          err instanceof Error
            ? err.message
            : 'Could not generate the export ZIP. Please try again.',
        success: null,
      });
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[#715447]/20 bg-[#FFFDF9] px-3.5 py-2.5 text-sm text-[#4E382E] placeholder:text-[#715447]/45 focus:outline-none focus:border-[#C95B63] focus:ring-2 focus:ring-[#E9AEBB]/35 transition-all';
  const labelClass = 'block text-xs font-medium text-[#715447] mb-1.5';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[#4E382E]/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slide-over Studio Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Personalize this website"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg bg-[#FFF5E9] h-full flex flex-col border-l border-[#715447]/15 shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#715447]/12 bg-[#FFFDF9] flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-medium text-[#4E382E]">
                  Personalize this website
                </h2>
                <p className="text-xs text-[#715447]/80">
                  Changes preview live behind this panel
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPreviewAsRecipient}
                  className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-[#715447]/20 bg-[#FFF5E9] text-xs font-medium text-[#715447] hover:bg-[#F4C6A8]/30 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Her View</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close personalization panel"
                  className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] rounded-lg text-[#715447] hover:bg-[#715447]/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Segmented Tab Bar */}
            <div className="px-4 py-2.5 bg-[#FFFDF9]/75 border-b border-[#715447]/10 grid grid-cols-4 gap-1.5">
              {(
                [
                  { id: 'basics', label: 'Photo' },
                  { id: 'letter', label: 'Letter & Voice' },
                  { id: 'journey', label: 'Notes & End' },
                  { id: 'export', label: 'Export' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[38px] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap truncate ${
                    activeTab === tab.id
                      ? 'bg-[#715447] text-[#FFFDF9] shadow-sm'
                      : 'text-[#715447] hover:bg-[#715447]/8'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              {activeTab === 'basics' && (
                <>
                  <div>
                    <label className={labelClass} htmlFor="recipient-name">
                      Her name or nickname
                    </label>
                    <input
                      id="recipient-name"
                      type="text"
                      value={config.recipientName}
                      onChange={(e) => updateField('recipientName', e.target.value)}
                      placeholder="e.g. baby, Maya"
                      className={inputClass}
                    />
                  </div>

                  {/* Photo Upload Block */}
                  <div className="rounded-2xl bg-[#FFFDF9] border border-[#715447]/14 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#4E382E] flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#C95B63]" />
                        Her Photograph
                      </span>
                      {config.photoDataUrl && (
                        <button
                          type="button"
                          onClick={() => updateField('photoDataUrl', null)}
                          className="inline-flex items-center gap-1 text-xs text-[#C95B63] hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      )}
                    </div>

                    {config.photoDataUrl ? (
                      <div className="rounded-xl overflow-hidden bg-[#F8EAE0] border border-[#715447]/10 p-2 flex justify-center">
                        <img
                          src={config.photoDataUrl}
                          alt="Uploaded preview"
                          className="max-h-48 object-contain rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#715447]/25 py-6 px-4 text-center text-xs text-[#715447]/75">
                        No photo uploaded yet. Her face will never be cropped or stretched.
                      </div>
                    )}

                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="w-full min-h-[42px] rounded-xl border border-[#715447]/20 bg-[#FFF5E9] text-sm font-medium text-[#4E382E] hover:bg-[#F4C6A8]/35 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      {config.photoDataUrl ? 'Replace Photograph' : 'Upload Photograph'}
                    </button>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="opening-title">
                      Scene 1 — Opening Greeting
                    </label>
                    <input
                      id="opening-title"
                      type="text"
                      value={config.openingTitle}
                      onChange={(e) => updateField('openingTitle', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="opening-sub">
                      Scene 1 — Opening Subtitle
                    </label>
                    <input
                      id="opening-sub"
                      type="text"
                      value={config.openingSubtitle}
                      onChange={(e) => updateField('openingSubtitle', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="photo-title">
                      Scene 2 — Photo Heading
                    </label>
                    <input
                      id="photo-title"
                      type="text"
                      value={config.photoTitle}
                      onChange={(e) => updateField('photoTitle', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="photo-sub">
                      Scene 2 — Personal Subtitle Below Photo
                    </label>
                    <input
                      id="photo-sub"
                      type="text"
                      value={config.photoSubtitle}
                      onChange={(e) => updateField('photoSubtitle', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="photo-note">
                      Scene 2 — Handwritten Note on Frame
                    </label>
                    <input
                      id="photo-note"
                      type="text"
                      value={config.photoHandwrittenNote}
                      onChange={(e) => updateField('photoHandwrittenNote', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {activeTab === 'letter' && (
                <>
                  {/* Voice Upload Block */}
                  <div className="rounded-2xl bg-[#FFFDF9] border border-[#715447]/14 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#4E382E] flex items-center gap-2">
                        <Music className="w-4 h-4 text-[#C95B63]" />
                        Your Voice Recording (MP3 / M4A)
                      </span>
                      {config.audioDataUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            onChange({ ...config, audioDataUrl: null, audioFileName: null })
                          }
                          className="inline-flex items-center gap-1 text-xs text-[#C95B63] hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      )}
                    </div>

                    {config.audioDataUrl ? (
                      <div className="space-y-2">
                        {config.audioFileName && (
                          <p className="text-xs text-[#715447] truncate">{config.audioFileName}</p>
                        )}
                        <audio controls src={config.audioDataUrl} className="w-full h-10" />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#715447]/25 py-5 px-4 text-center text-xs text-[#715447]/75">
                        Upload an MP3 or M4A recording of your voice so she can listen to you directly.
                      </div>
                    )}

                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*,.mp3,.m4a,.wav,.ogg"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => audioInputRef.current?.click()}
                      className="w-full min-h-[42px] rounded-xl border border-[#715447]/20 bg-[#FFF5E9] text-sm font-medium text-[#4E382E] hover:bg-[#F4C6A8]/35 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      {config.audioDataUrl ? 'Replace Audio Recording' : 'Upload Voice Recording'}
                    </button>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="letter-heading">
                      Scene 4 — Letter Heading
                    </label>
                    <input
                      id="letter-heading"
                      type="text"
                      value={config.letterHeading}
                      onChange={(e) => updateField('letterHeading', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="letter-body">
                      Scene 4 — Main Birthday Letter (separate paragraphs with a blank line)
                    </label>
                    <textarea
                      id="letter-body"
                      rows={12}
                      value={config.letterBody}
                      onChange={(e) => updateField('letterBody', e.target.value)}
                      className={`${inputClass} leading-relaxed resize-y`}
                    />
                  </div>
                </>
              )}

              {activeTab === 'journey' && (
                <>
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg text-[#4E382E]">
                      Scene 3 — 5 Journey Messages
                    </h3>
                    {config.journeyMessages.map((msg, idx) => (
                      <div key={idx}>
                        <label className={labelClass} htmlFor={`journey-${idx}`}>
                          Keepsake #{idx + 1}
                        </label>
                        <input
                          id={`journey-${idx}`}
                          type="text"
                          value={msg}
                          onChange={(e) => updateJourneyMessage(idx, e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#715447]/12 space-y-3">
                    <h3 className="font-serif text-lg text-[#4E382E]">
                      Scene 6 — 3 Keepsake Box Envelopes
                    </h3>
                    {config.giftMessages.map((msg, idx) => (
                      <div key={idx}>
                        <label className={labelClass} htmlFor={`gift-${idx}`}>
                          Envelope #{idx + 1}
                        </label>
                        <input
                          id={`gift-${idx}`}
                          type="text"
                          value={msg}
                          onChange={(e) => updateGiftMessage(idx, e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#715447]/12 space-y-3">
                    <h3 className="font-serif text-lg text-[#4E382E]">
                      Scene 7 — Final Emotional Ending
                    </h3>
                    <div>
                      <label className={labelClass} htmlFor="finale-1">
                        First Line
                      </label>
                      <input
                        id="finale-1"
                        type="text"
                        value={config.finaleLine1}
                        onChange={(e) => updateField('finaleLine1', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="finale-2">
                        Second Line
                      </label>
                      <input
                        id="finale-2"
                        type="text"
                        value={config.finaleLine2}
                        onChange={(e) => updateField('finaleLine2', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="finale-greeting">
                        Birthday Greeting
                      </label>
                      <input
                        id="finale-greeting"
                        type="text"
                        value={config.finaleGreeting}
                        onChange={(e) => updateField('finaleGreeting', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="finale-closing">
                        Final Line
                      </label>
                      <input
                        id="finale-closing"
                        type="text"
                        value={config.finaleClosing}
                        onChange={(e) => updateField('finaleClosing', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'export' && (
                <div className="space-y-5">
                  <div className="rounded-2xl bg-[#FFFDF9] border border-[#715447]/15 p-5 space-y-3">
                    <h3 className="font-serif text-xl text-[#4E382E]">
                      Export Your Finished Website
                    </h3>
                    <p className="text-sm text-[#715447] leading-relaxed">
                      This packages your uploaded photo, voice recording, all edited messages, teddy bear animations, and layouts into a complete website with the editor icon completely hidden for her.
                    </p>

                    <div className="pt-2 space-y-3">
                      <button
                        type="button"
                        disabled={exportStatus.loading !== null}
                        onClick={() => handleDownloadZip('static')}
                        className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#715447] text-[#FFFDF9] text-sm font-medium hover:bg-[#5E4439] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        <Download className="w-4 h-4" />
                        <span>
                          {exportStatus.loading === 'static'
                            ? 'Building Vercel Website ZIP...'
                            : 'Download Ready-to-Deploy Website (.zip)'}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={exportStatus.loading !== null}
                        onClick={() => handleDownloadZip('source')}
                        className="w-full min-h-[46px] px-5 py-2.5 rounded-xl border border-[#715447]/25 bg-[#FFF5E9] text-[#4E382E] text-sm font-medium hover:bg-[#F4C6A8]/35 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        <FolderArchive className="w-4 h-4" />
                        <span>
                          {exportStatus.loading === 'source'
                            ? 'Packaging Source Project...'
                            : 'Download GitHub / Vite Source (.zip)'}
                        </span>
                      </button>
                    </div>

                    {exportStatus.error && (
                      <p className="text-xs text-[#C95B63] pt-1">{exportStatus.error}</p>
                    )}
                    {exportStatus.success && (
                      <p className="text-xs text-[#5E7454] pt-1 font-medium">
                        {exportStatus.success}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-[#FFFDF9]/80 border border-[#715447]/12 p-5 space-y-2.5">
                    <h4 className="font-serif text-lg text-[#4E382E]">
                      How to put it online on Vercel (2 minutes)
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-xs text-[#715447] leading-relaxed">
                      <li>
                        Download the <strong className="text-[#4E382E]">Ready-to-Deploy Website (.zip)</strong> above and unzip the folder.
                      </li>
                      <li>
                        If using GitHub: download the <strong className="text-[#4E382E]">GitHub / Vite Source (.zip)</strong>, upload the unzipped files to a new GitHub repo, and import it in <strong className="text-[#4E382E]">vercel.com</strong> (Vercel auto-detects Vite).
                      </li>
                      <li>
                        Or with the Ready-to-Deploy folder, run <code className="px-1.5 py-0.5 rounded bg-[#FFF5E9] border border-[#715447]/15">npx vercel --prod</code> inside the unzipped folder to get her private link immediately.
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Controls */}
            <div className="px-5 py-3.5 border-t border-[#715447]/12 bg-[#FFFDF9] flex items-center justify-between gap-3">
              {confirmReset ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#715447]">Reset all text & media?</span>
                  <button
                    type="button"
                    onClick={handleResetConfirm}
                    className="px-2.5 py-1.5 rounded-lg bg-[#C95B63] text-white text-xs font-medium cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-2.5 py-1.5 rounded-lg border border-[#715447]/20 text-xs text-[#715447] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-lg text-xs font-medium text-[#715447] hover:bg-[#715447]/8 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveClick}
                className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-xl bg-[#715447] text-[#FFFDF9] text-sm font-medium hover:bg-[#5E4439] transition-colors cursor-pointer whitespace-nowrap"
              >
                {saveState === 'saved' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{saveState === 'saving' ? 'Saving...' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
