
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
  const userJSON = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userJSON ? JSON.parse(userJSON) : null;
}

function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}


function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

function getShifts() {
}

function saveShift(shift) {
}