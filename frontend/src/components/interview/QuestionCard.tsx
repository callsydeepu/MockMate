import React, { useState } from 'react';
import { Volume2, VolumeX, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { Question } from '../../context/interview/InterviewContext';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
}) => {
  // const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // removed unused timerRef
  const [tipsOpen, setTipsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Trigger web voice synthesizer
  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(question.text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  const getCategoryStyle = (cat: string) => {
    if (cat === 'technical') return 'tag-neon-cyan';
    if (cat === 'system-design') return 'tag-neon-purple';
    return 'tag-neon-pink';
  };

  return (
    <Card className="border-slate-200/50 space-y-4 relative overflow-hidden shadow-sm bg-white/70">
      {/* Visual background card grid */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-2xl rounded-full pointer-events-none" />

      {/* Progress index header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-200/50">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded uppercase ${getCategoryStyle(question.category)}`}>
            {question.category}
          </span>
          <span className="text-[10px] text-slate-500 font-bold">Suggested: {question.suggestedDuration / 60}m</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono font-bold">
          Q. {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Actual Question block */}
      <div className="space-y-4">
        <div className="flex justify-between gap-4 items-start">
          <h2 className="text-sm md:text-base font-bold text-slate-900 leading-relaxed">
            {question.text}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={speakQuestion}
            className="p-2 rounded-xl flex-shrink-0"
            title={isSpeaking ? 'Mute' : 'Read question'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-sky-600" /> : <Volume2 className="w-4 h-4 text-slate-500 hover:text-slate-800" />}
          </Button>
        </div>

        {/* Hints / Tips Accordion Drawer */}
        <div className="border border-slate-200/50 bg-white/50 rounded-xl overflow-hidden shadow-inner">
          <button
            onClick={() => setTipsOpen(!tipsOpen)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-violet-500" />
              Need help? Review coach recommendations
            </span>
            {tipsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {tipsOpen && (
            <div className="px-4 pb-3 space-y-2 border-t border-slate-200/50 pt-2 text-[10px] text-slate-600 font-semibold leading-relaxed">
              {question.tips.map((tip, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-violet-600 font-bold">0{i + 1}.</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
