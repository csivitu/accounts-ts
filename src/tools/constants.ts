export const constants = {
    vitEmailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((vitstudent.ac.in)|(vit.ac.in))$/,
    emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    mobileRegex: /^[6-9]\d{8,9}$/, // 9-10 characters
    passwordRegex: /^[a-zA-Z0-9`!@#$%^&*()-/:'.,{}_"~]{8,16}$/, // 8-16 characters,
    regNoRegex: /^\d\d[A-Z]{3}[0-9]{4}$/,
    usernameRegex: /^[a-zA-Z0-9`!@#$%^&*()-/:'.,{}_"~]{3,20}$/,

    defaultResponse: 'defaultResponse',

    home: 'homePage',

    serverError: 'serverError',

    invalidUsername: 'invalidUsername',
    invalidEmail: 'invalidEmail',
    invalidMobile: 'invalidMobile',
    invalidPassword: 'invalidPassword',
    invalidRegNo: 'invalidRegNo',
    incorrectDetails: 'incorrectDetails',

    participantNotFound: 'participantNotFound',
    duplicate: 'duplicate',
    loginSuccess: 'loginSuccess',
    logoutSuccess: 'logoutSuccess',
    maxFieldLengthExceeded: 'maxFieldLengthExceeded',
    adminLoginSuccess: 'adminLoginSuccess',
    adminLogoutSuccess: 'adminLogoutSuccess',
    recaptchaFailed: 'recaptchaFailed',

    registrationSuccess: 'registrationSuccess',
    notVerified: 'notVerified',

    questionAdded: 'questionAdded',
    passwordResetMail: 'passwordResetMailSent',
    passwordResetSuccess: 'passwordResetSuccess',

    emailFrom: 'CSI-VIT',
    senderEmail: 'tech@csivit.com',
    emailReplyTo: 'askcsivit.com',

    sendResetMailSubject: 'Reset your CCS Password',
    sendVerificationMailSubject: 'Verify your CCS Account',
    verificationSuccess: 'verificationSuccess',
};

export default constants;
