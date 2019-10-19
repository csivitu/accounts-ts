module.exports = {
    emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((vitstudent.ac.in)|(vit.ac.in))$/,
    mobileRegex: /^[6-9]\d{8,9}$/, // 9-10 characters
    passwordRegex: /^[a-zA-Z0-9`!@#$%^&*()-/:'.,{}"~]{8,16}$/, // 8-16 characters,

    defaultResponse: 'defaultResponse',

    home: 'homePage',

    invalidEmail: 'invalidEmail',
    invalidMobile: 'invalidMobile',
    invalidPassword: 'invalidPassword',
    incorrectPassword: 'incorrectPassword',

    participantNotFound: 'participantNotFound',
    loginSuccess: 'loginSuccess',

    registrationSuccess: 'registrationSuccess',
};
