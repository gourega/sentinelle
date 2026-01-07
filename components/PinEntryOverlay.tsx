
import React, { useState, useEffect } from 'react';

interface PinEntryOverlayProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const PIN_REQUIRED = "1234";

const PinEntryOverlay: React.FC<PinEntryOverlayProps> = ({ onSuccess, onCancel }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeypad = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === PIN_REQUIRED) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => setPin(''), 500);
      }
    }
  }, [pin, onSuccess]);

  return (
    <div className="fixed inset-0 z-[150] bg-background-dark/98 backdrop-blur-2xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="w-full max-w-xs space-y-12">
        <div className="text-center space-y-4">
          <div className="size-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Portail Partenaire</h2>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Saisissez votre code d'accès</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`size-4 rounded-full border-2 transition-all duration-300 ${
                pin.length > i 
                  ? 'bg-primary border-primary shadow-[0_0_15px_#13ec6d]' 
                  : error ? 'border-red-500 animate-shake' : 'border-white/20'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'].map((key, i) => {
            if (key === '') return <div key={i} />;
            if (key === 'delete') {
              return (
                <button 
                  key={i}
                  onClick={handleBackspace}
                  className="size-20 rounded-full flex items-center justify-center text-slate-500 active:scale-90 transition-all"
                >
                  <span className="material-symbols-outlined text-2xl">backspace</span>
                </button>
              );
            }
            return (
              <button 
                key={i}
                onClick={() => handleKeypad(key)}
                className="size-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xl font-black text-white active:bg-primary active:text-background-dark transition-all"
              >
                {key}
              </button>
            );
          })}
        </div>

        <button 
          onClick={onCancel}
          className="w-full py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
        >
          Annuler
        </button>
      </div>

      <style>{`
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default PinEntryOverlay;
