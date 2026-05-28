import React from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  SkipForward, 
  Square 
} from 'lucide-react';
import { Button } from '../common/Button';

interface InterviewControlsProps {
  cameraEnabled: boolean;
  micEnabled: boolean;
  isPaused: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isGeneratingNext: boolean;
  isAnswerSubmitted: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onPause: () => void;
  onResume: () => void;
  onNext: () => void;
  onGenerateNext: () => void;
  onEnd: () => void;
}

export const InterviewControls: React.FC<InterviewControlsProps> = ({
  cameraEnabled,
  micEnabled,
  isPaused,
  isLastQuestion,
  isGeneratingNext,
  isAnswerSubmitted,
  onToggleCamera,
  onToggleMic,
  onPause,
  onResume,
  onNext,
  onGenerateNext,
  onEnd,
}) => {
  return (
    <div className="glass-panel px-6 py-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between border-white/10 shadow-2xl">
      {/* Mic and Camera switches */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCamera}
          className="p-2.5 rounded-xl"
          title={cameraEnabled ? 'Turn off camera' : 'Turn on camera'}
          disabled={isGeneratingNext}
        >
          {cameraEnabled ? <Video className="w-4.5 h-4.5 text-cyan-400" /> : <VideoOff className="w-4.5 h-4.5 text-pink-400" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMic}
          className="p-2.5 rounded-xl"
          title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
          disabled={isGeneratingNext}
        >
          {micEnabled ? <Mic className="w-4.5 h-4.5 text-cyan-400" /> : <MicOff className="w-4.5 h-4.5 text-pink-400" />}
        </Button>
      </div>

      {/* Primary actions: Next, Pause */}
      <div className="flex items-center gap-3">
        {isPaused ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={onResume}
            icon={<Play className="w-4 h-4 text-emerald-400" />}
            className="rounded-xl px-4 py-2"
            disabled={isGeneratingNext}
          >
            Resume
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={onPause}
            icon={<Pause className="w-4 h-4 text-violet-400" />}
            className="rounded-xl px-4 py-2"
            disabled={isGeneratingNext}
          >
            Pause
          </Button>
        )}

        {isLastQuestion ? (
          <Button
            variant="primary"
            size="sm"
            onClick={onGenerateNext}
            loading={isGeneratingNext}
            disabled={isGeneratingNext || !isAnswerSubmitted}
            icon={<SkipForward className="w-4 h-4 text-cyan-300 animate-pulse" />}
            className="rounded-xl px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 border-none text-white hover:opacity-90 shadow-md shadow-violet-500/10"
            title={!isAnswerSubmitted ? "Please submit your answer first" : "Generate the next customized question"}
          >
            Generate Next Question
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={onNext}
            disabled={isGeneratingNext || !isAnswerSubmitted}
            icon={<SkipForward className="w-4 h-4" />}
            className="rounded-xl px-4 py-2"
            title={!isAnswerSubmitted ? "Please submit your answer first" : "Move to the next question"}
          >
            Next Question
          </Button>
        )}
      </div>

      {/* Stop / End interview */}
      <div>
        <Button
          variant="danger"
          size="sm"
          onClick={onEnd}
          disabled={isGeneratingNext}
          icon={<Square className="w-3.5 h-3.5 fill-current" />}
          className="rounded-xl px-4 py-2 text-xs"
        >
          End Interview
        </Button>
      </div>
    </div>
  );
};
