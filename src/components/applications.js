const APPS_KEY = 'applications';

// Har user ki applications alag save hoti hain (email ke basis par)
const getCurrentEmail = () => {
  try {
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    return profile?.email || null;
  } catch {
    return null;
  }
};

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(APPS_KEY)) || {};
  } catch {
    return {};
  }
};

export const getApplications = () => {
  const email = getCurrentEmail();
  if (!email) return [];
  return readAll()[email] || [];
};

export const hasApplied = (internshipId) =>
  getApplications().some((a) => a.internshipId === internshipId);

// internship = { id, title, company, location, duration, salary }
export const applyToInternship = (internship) => {
  const email = getCurrentEmail();
  if (!email) return { ok: false, error: 'Please log in to apply.' };

  const all = readAll();
  const mine = all[email] || [];

  if (mine.some((a) => a.internshipId === internship.id)) {
    return { ok: false, error: 'You have already applied to this internship.' };
  }

  const application = {
    id: Date.now(),
    internshipId: internship.id,
    title: internship.title,
    company: internship.company,
    location: internship.location || 'Not specified',
    duration: internship.duration || 'Not specified',
    salary: internship.salary || 'Not disclosed',
    appliedAt: new Date().toISOString(),
    status: 'Applied',
  };

  all[email] = [application, ...mine];
  localStorage.setItem(APPS_KEY, JSON.stringify(all));
  return { ok: true, application };
};

export const withdrawApplication = (applicationId) => {
  const email = getCurrentEmail();
  if (!email) return;
  const all = readAll();
  all[email] = (all[email] || []).filter((a) => a.id !== applicationId);
  localStorage.setItem(APPS_KEY, JSON.stringify(all));
};