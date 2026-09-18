
const STORAGE_KEYS = {
  USERS: "mms_users",
  CURRENT_USER: "mms_current_user",
  SHIFTS: "mms_shifts",
};

function getUsers() {
  const usersJSON = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersJSON ? JSON.parse(usersJSON) : [];
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser() {
  const sessionJSON = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!sessionJSON) return null;

  const session = JSON.parse(sessionJSON);
  if (Date.now() > session.expiresAt) {
    clearCurrentUser();
    return null;
  }

  return session.user;
}

function setCurrentUser(user) {
  const session = {
    user: user,
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));
}

function updateUser(oldUsername, updatedUser) {
  const users = getUsers();
  const index = users.findIndex(u => u.username === oldUsername);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
}

function updateShift(oldSlug, updatedShift) {
  const shifts = getShifts();
  const index = shifts.findIndex(s => s.slug === oldSlug);
  if (index !== -1) {
    shifts[index] = updatedShift;
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
  }

}

function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

function getShifts() {
  const shiftsJSON = localStorage.getItem(STORAGE_KEYS.SHIFTS);
  return shiftsJSON ? JSON.parse(shiftsJSON) : [];
}

function saveShift(shift) {
  const shifts = getShifts();
  shifts.push(shift);
  localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
}

function isSlugTaken(slug) {
  const shifts = getShifts();
  return shifts.some(shift => shift.slug === slug);
}