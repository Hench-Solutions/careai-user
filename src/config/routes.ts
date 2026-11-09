/** Every in-app path lives here; never type a route string in a component. */
export const ROUTES = {
  home: "/",
  login: "/login",
  agent: {
    base: "/agent",
    dashboard: "/agent/dashboard",
    caseRegistration: "/agent/case-registration",
    referralInvoice: "/agent/referral-invoice",
    caseStatus: "/agent/case-status",
    actionRequired: "/agent/action-required",
  },
  patient: {
    base: "/patient",
    dashboard: "/patient/dashboard",
    overseasTreatment: "/patient/overseas-treatment",
    consultExpert: "/patient/consult-expert",
    secondOpinion: "/patient/second-opinion",
    educationPrevention: "/patient/education-prevention",
    contactUs: "/patient/contact-us",
  },
} as const;
