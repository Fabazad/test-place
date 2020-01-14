const constants = require("./constants");

const AUTH = constants.AUTH_CONDITIONS;

/**
 * Check the auth condition on a field
 * @param fieldAuth
 * @param userId
 * @param userRole
 * @param instance
 * @returns {boolean}
 */
const checkFieldAuth = (fieldAuth, userId, userRole, instance) => {
    //Needs to match each conditions
    fieldAuth.forEach(rule => {
        if (rule === AUTH.ANY || userRole === constants.ROLES.ADMIN) {
            return true;
        }
        if (rule === AUTH.IS_SELLER && instance.seller.toString() !== userId) {
            return false
        }
    });
    return true;
};

class AuthHelpers {

    /**
     * Indicates if the use is authorized to apply the update request
     * @param userId
     * @param fields
     * @param userRole
     * @param objectSchema
     * @param instance
     * @returns boolean
     */
    static update(userId, fields, userRole, objectSchema, instance) {
        const fieldNames = Object.keys(fields);
        fieldNames.forEach(fieldName => {
            // Field has to be in the object schema
            if (!(fieldName in objectSchema)) {
                return false;
            }

            const fieldAuth = objectSchema[fieldName].auth.update;

            // If no auth rules then no authorization
            if (!fieldAuth.length) {
                return false;
            }

            // Check if every condition of the field have been respected.
            if (!checkFieldAuth(fieldAuth, userId, userRole, instance)) {
                return false;
            }
        });
        return true;
    }
}

module.exports = AuthHelpers;