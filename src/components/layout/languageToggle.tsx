import { useLangStore } from '../../store/languagestore';

export const LanguageToggle = () => {
  const { lang, toggle } = useLangStore();
  const isAr = lang === 'ar';

  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border
                 bg-white hover:bg-surface-hover text-slate-600 hover:text-slate-900
                 text-sm font-semibold transition-all duration-200 select-none"
    >
      {/* Flag + current language label */}
      <span className="text-base leading-none">{isAr ? '🇸🇦' : '🇬🇧'}</span>
      <span className="font-bold tracking-wide">{isAr ? 'AR' : 'EN'}</span>
      {/* Pipe separator */}
      <span className="text-slate-300 mx-0.5">|</span>
      {/* Other language hint */}
      <span className="text-slate-400 font-normal">{isAr ? 'EN' : 'AR'}</span>
    </button>
  );
};