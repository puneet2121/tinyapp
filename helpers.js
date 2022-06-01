const getUserByEmail = function(email,userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email)
      return user;
  }
};
const generateRandomString = function() {
  let ranString = '';
  let char = 'ABCDEFGHIJKLMNOPQRSTabcdefghijklmnopqrst0123456789';
  let charLength = char.length;
  for (let i = 0; i <= 6; i++) {
    ranString += char.charAt(Math.floor(Math.random() * charLength));
  }
  return ranString;
};

module.exports = {getUserByEmail, generateRandomString};