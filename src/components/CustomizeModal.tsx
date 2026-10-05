import React, { useState } from 'react';
import { LoveStoryConfig } from '../types';
import { X, Heart, Plus, Trash2, Sparkles, Check } from 'lucide-react';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LoveStoryConfig;
  onSave: (newConfig: LoveStoryConfig) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [partnerName, setPartnerName] = useState(config.partnerName);
  const [senderName, setSenderName] = useState(config.senderName);
  const [proposalQuestion, setProposalQuestion] = useState(config.proposalQuestion);
  const [specialDate, setSpecialDate] = useState(config.specialDate || '');
  const [reasons, setReasons] = useState<string[]>([...config.reasonsToLove]);
  const [newReason, setNewReason] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleAddReason = () => {
    if (!newReason.trim()) return;
    setReasons([...reasons, newReason.trim()]);
    setNewReason('');
  };

  const handleRemoveReason = (idx: number) => {
    setReasons(reasons.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    onSave({
      partnerName: partnerName.trim() || 'My Beautiful Love',
      senderName: senderName.trim() || 'Forever Yours',
      proposalQuestion: proposalQuestion.trim() || 'Will you marry me?',
      specialDate,
      reasonsToLove: reasons.length > 0 ? reasons : config.reasonsToLove,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/30 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white via-pink-50/50 to-rose-50/70 border-2 border-rose-300/60 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(244,63,94,0.2)] text-rose-950">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-rose-400 hover:text-rose-700 hover:bg-rose-100/60 transition-colors"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-rose-100 border border-rose-300 text-rose-600">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-wide text-rose-900">
              Personalize Your Proposal
            </h2>
            <p className="text-xs text-rose-600/80">
              Customize her name, your sweet message, and love reasons
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Her Name / Sweet Nickname
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="e.g. My Princess / Priya"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-300 text-rose-950 placeholder:text-rose-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Rohit"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-300 text-rose-950 placeholder:text-rose-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              The Grand Proposal Question
            </label>
            <input
              type="text"
              value={proposalQuestion}
              onChange={(e) => setProposalQuestion(e.target.value)}
              placeholder="Will you marry me and make me the happiest person alive?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-300 text-rose-950 placeholder:text-rose-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-1">
              Special Date or Anniversary (Optional)
            </label>
            <input
              type="text"
              value={specialDate}
              onChange={(e) => setSpecialDate(e.target.value)}
              placeholder="e.g. October 14 · The Day We Met"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-300 text-rose-950 placeholder:text-rose-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 shadow-xs"
            />
          </div>

          {/* Reasons to Love Her */}
          <div>
            <label className="block text-xs font-semibold text-rose-900 mb-2">
              Reasons Why You Love Her (Appears in 3D Pop-Up Card)
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {reasons.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-rose-200 text-xs shadow-xs"
                >
                  <span className="truncate text-rose-900">
                    <span className="text-rose-500 font-bold mr-1.5">{i + 1}.</span>
                    {r}
                  </span>
                  <button
                    onClick={() => handleRemoveReason(i)}
                    className="p-1 text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddReason()}
                placeholder="Add another reason why she is so special..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-rose-300 text-rose-950 placeholder:text-rose-300 focus:outline-none focus:border-rose-500 shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddReason}
                className="px-3.5 py-2 text-xs font-semibold bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-xl text-rose-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-rose-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-rose-700 hover:text-rose-900 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-xl shadow-md shadow-rose-300/40 transition-all cursor-pointer active:scale-95"
          >
            {savedNotice ? (
              <>
                <Check className="w-4 h-4 text-emerald-100" />
                Saved with Love!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
