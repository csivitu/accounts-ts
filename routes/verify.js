const constants = require('./constants');

module.exports = {
    verifyEmail: (email) => constants.emailRegex.test(email),
    verifyMobile: (mobile) => constants.mobileRegex.verifyMobile.test(mobile),
    verifyPassword: (password) => constants.passwordRegex.verifyPassword.test(password),
};
