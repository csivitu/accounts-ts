const constants = require('./constants');

module.exports = {
    verifyEmail: (email) => constants.emailRegex.test(email),
    verifyMobile: (mobile) => constants.mobileRegex.test(mobile),
    verifyPassword: (password) => constants.passwordRegex.test(password),
    verifyRegNo: (regNo) => constants.regNoRegex.test(regNo),
};
