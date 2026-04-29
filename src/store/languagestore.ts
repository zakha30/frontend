import { create } from 'zustand';
import i18n from '../i18n';
import { initReactI18next } from 'react-i18next';


type Lang = 'ar' | 'en';

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const stored = (localStorage.getItem('lang') as Lang) ?? 'ar';

export const useLangStore = create<LangState>((set, get) => ({
  lang: stored,

  setLang: (lang) => {
    localStorage.setItem('lang', lang);
    i18n.changeLanguage(lang);
    // Flip document direction and lang attribute
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    set({ lang });
  },

  toggle: () => {
    const next: Lang = get().lang === 'ar' ? 'en' : 'ar';
    get().setLang(next);
  },
}));