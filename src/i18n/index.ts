import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ── Arabic translations ────────────────────────────────────────────────────
import arCommon       from './locales/ar/common.json';
import arHome         from './locales/ar/home.json';
import arDashboard    from './locales/ar/dashboard.json';
import arDrivers      from './locales/ar/drivers.json';
import arFleet        from './locales/ar/fleet.json';
import arForum        from './locales/ar/forum.json';
import arJobs         from './locales/ar/jobs.json';
import arClassifieds  from './locales/ar/classifieds.json';
import arLoads        from './locales/ar/loads.json';
import arAuth         from './locales/ar/auth.json';

// ── English translations ───────────────────────────────────────────────────
import enCommon       from './locales/en/common.json';
import enHome         from './locales/en/home.json';
import enDashboard    from './locales/en/dashboard.json';
import enDrivers      from './locales/en/drivers.json';
import enFleet        from './locales/en/fleet.json';
import enForum        from './locales/en/forum.json';
import enJobs         from './locales/en/jobs.json';
import enClassifieds  from './locales/en/classifieds.json';
import enLoads        from './locales/en/loads.json';
import enAuth         from './locales/en/auth.json';

const stored = (localStorage.getItem('lang') as 'ar' | 'en') ?? 'ar';

// Set initial document direction before first render
document.documentElement.dir  = stored === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = stored;

i18n
  .use(initReactI18next)
  .init({
    lng: stored,
    fallbackLng: 'en',
    defaultNS: 'common',
    resources: {
      ar: {
        common:      arCommon,
        home:        arHome,
        dashboard:   arDashboard,
        drivers:     arDrivers,
        fleet:       arFleet,
        forum:       arForum,
        jobs:        arJobs,
        classifieds: arClassifieds,
        loads:       arLoads,
        auth:        arAuth,
      },
      en: {
        common:      enCommon,
        home:        enHome,
        dashboard:   enDashboard,
        drivers:     enDrivers,
        fleet:       enFleet,
        forum:       enForum,
        jobs:        enJobs,
        classifieds: enClassifieds,
        loads:       enLoads,
        auth:        enAuth,
      },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;