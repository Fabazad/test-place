
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="06474d37-5f39-5b76-95d4-1ee94ece9087")}catch(e){}}();
import { configs } from "../../configs.js";
import { Role } from "../../utils/constants.js";
import { isDecodedUser } from "../../utils/DecodedUser.type.js";
import { isLanguage, Language } from "../../utils/Language.js";
import { createSingletonGetter } from "../../utils/singleton.js";
import axios from "axios";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
const createAuthManager = () => {
    const secret = configs.JWT_KEY;
    const longSignInDuration = configs.LONG_SIGN_IN_DURATION;
    const shortSignInDuration = configs.SHORT_SIGN_IN_DURATION;
    const saltRounds = configs.SALT_ROUNDS;
    const googleClient = new OAuth2Client(configs.SECRET_GOOGLE_CLIENT_ID);
    return {
        decodeUser: (token) => {
            const decoded = jwt.verify(token, secret);
            if (isDecodedUser(decoded))
                return decoded;
            return null;
        },
        checkRole: (role, decodedUser) => {
            return !!(decodedUser &&
                (decodedUser.roles.includes(role) || decodedUser.roles.includes(Role.ADMIN)));
        },
        encodeUser: ({ decodedUser: { userId, roles, amazonId }, staySignedIn }) => {
            const payload = { userId, roles, amazonId };
            return jwt.sign(payload, secret, {
                expiresIn: staySignedIn ? shortSignInDuration : longSignInDuration,
            });
        },
        hashPassword: (password) => {
            return bcrypt.hashSync(password, saltRounds);
        },
        comparePasswords: (password, hashedPassword) => {
            return bcrypt.compareSync(password, hashedPassword);
        },
        generateRandomToken: () => {
            return Array.from({ length: 16 }, () => {
                const charCode = Math.floor(Math.random() * 62);
                if (charCode < 10) {
                    return String.fromCharCode(charCode + 48); // 0-9
                }
                else if (charCode < 36) {
                    return String.fromCharCode(charCode + 55); // A-Z
                }
                else {
                    return String.fromCharCode(charCode + 61); // a-z
                }
            }).join("");
        },
        facebookLogin: async ({ accessToken }) => {
            try {
                const response = await axios.get("https://graph.facebook.com/v11.0/me", {
                    params: {
                        access_token: accessToken,
                        fields: "id,name,email,first_name",
                    },
                });
                const { id, name, email, first_name } = response.data;
                if (!email)
                    return { success: false, errorCode: "facebook_account_missing_email" };
                const userName = first_name
                    ? first_name + Math.round(Math.random() * 10000).toString()
                    : name;
                return { success: true, data: { facebookId: id, name: userName, email } };
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    return {
                        success: false,
                        errorCode: "unknown_error",
                        errorMessage: error.message,
                    };
                }
                return {
                    success: false,
                    errorCode: "unknown_error",
                    errorMessage: error.message,
                };
            }
        },
        googleLogin: async ({ credential }) => {
            try {
                // Verify the token
                const ticket = await googleClient.verifyIdToken({
                    idToken: credential,
                    audience: configs.PUBLIC_GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
                });
                // Get the payload (the user information)
                const payload = ticket.getPayload();
                if (!payload)
                    return {
                        success: false,
                        errorCode: "unknown_error",
                        errorMessage: "payload is null",
                    };
                const googleId = payload.sub;
                const email = payload.email;
                const name = payload.given_name;
                const picture = payload.picture;
                const language = payload.locale && isLanguage(payload.locale) ? payload.locale : Language.FR;
                console.log({ googleId, name, email, language, picture });
                // You can now use this information as needed, for example, store it in your database or create a session
                return { success: true, data: { googleId, name, email, language } };
            }
            catch (error) {
                return {
                    success: false,
                    errorCode: "unknown_error",
                    errorMessage: error?.toString(),
                };
            }
        },
    };
};
export const getAuthManager = createSingletonGetter(createAuthManager);
//# sourceMappingURL=index.js.map
//# debugId=06474d37-5f39-5b76-95d4-1ee94ece9087
