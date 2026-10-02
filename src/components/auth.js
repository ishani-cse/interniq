const USERS_KEY = 'users';

const normalize = (email) => email.trim().toLowerCase();

export const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveSession = (user) => {
  localStorage.setItem(
    'userProfile',
    JSON.stringify({ name: user.name, email: user.email, skills: user.skills })
  );
};

export const registerUser = ({ name, email, password }) => {
  const users = getUsers();

  if (users.some((u) => u.email === normalize(email))) {
    return { ok: false, error: 'This email is already registered. Please log in.' };
  }

  const user = {
    name: name.trim(),
    email: normalize(email),
    password, // demo only - real app mein backend par hash hota hai
    skills: ['Python', 'React', 'JavaScript', 'UI/UX'],
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  saveSession(user);
  return { ok: true };
};

export const loginUser = (email, password) => {
  const user = getUsers().find((u) => u.email === normalize(email));

  if (!user) return { ok: false, error: 'No account found with this email. Please sign up.' };
  if (user.password !== password) return { ok: false, error: 'Incorrect password.' };

  saveSession(user);
  return { ok: true };
};