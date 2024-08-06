import { configs } from "../../configs.js";
import { Role } from "../../utils/constants.js";
import { isDecodedUser } from "../../utils/DecodedUser.type.js";
import { createSingletonGetter } from "../../utils/singleton.js";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const createAuthManager = () => {
    const secret = configs.JWT_KEY;
    const longSignInDuration = configs.LONG_SIGN_IN_DURATION;
    const shortSignInDuration = configs.SHORT_SIGN_IN_DURATION;
    const saltRounds = configs.SALT_ROUNDS;
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
    };
};
export const getAuthManager = createSingletonGetter(createAuthManager);
