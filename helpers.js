const getUserByEmail = function(email,userDatabase) {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email)
      return user;
  }
};
module.exports = getUserByEmail;