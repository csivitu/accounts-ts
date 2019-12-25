import { constants } from './constants';

export const verifyVITEmail = (email: string) => constants.vitEmailRegex.test(email);
export const verifyEmail = (email: string) => constants.emailRegex.test(email);
export const verifyMobile = (mobile: string) => constants.mobileRegex.test(mobile);
export const verifyPassword = (password: string) => constants.passwordRegex.test(password);
export const verifyRegNo = (regNo: string) => constants.regNoRegex.test(regNo);
export const verifyUsername = (username: string) => constants.usernameRegex.test(username);
