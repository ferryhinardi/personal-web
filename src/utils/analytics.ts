export const initGA = async (measurementId: string) => {
  const {default: ReactGA} = await import('react-ga4');
  ReactGA.initialize(measurementId);
};

export const logPageView = async () => {
  const {default: ReactGA} = await import('react-ga4');
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
};

export const logEvent = async (category: string, action: string, label?: string) => {
  const {default: ReactGA} = await import('react-ga4');
  ReactGA.event({
    category,
    action,
    label,
  });
};
