import {body} from "express-validator";

const registerUserValidator = () =>{
    return [
        body("name")
        .trim()
        .notEmpty()
        .withMessage("name is required"),

        body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("email must be valid")
        .normalizeEmail(),

        body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required"),

        body("username")
        .optional()
        .trim()
        .isLowercase()
        .withMessage("username must be in lower case")
        .isLength({min:3})
        .withMessage("Username must be atleast 3 character long"),

        body("fullName")
        .optional()
        .trim()
    ]
};

const loginUserValidator = () =>{
    return [
        body("username")
        .optional()
        .trim(),

        body("email")
        .optional()
        .trim()
        .normalizeEmail(),

        body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required")
    ]
};

const vehicleCardValidator = () => {
    return [
        body("vehicleNumber")
        .notEmpty()
        .withMessage("Vehicle Number is required")
        .isNumeric()
        .withMessage("Vehicle Number must be numeric"),

        body("registrationNumber")
        .trim()
        .notEmpty()
        .withMessage("Registration Number is required")
    ]
};

const vehicleCardUpdateValidator = () => {
    return [
        body("vehicleNumber").optional().isNumeric().withMessage("Vehicle Number must be numeric"),
        body("registrationNumber").optional().trim(),
        body("name").optional().trim(),
        body("designation").optional().trim(),
        body("vehicleType").optional().trim(),
        body("mobileNumber").optional(),
        body("address").optional().trim()
    ]
};

const businessCardValidator = () => {
    return [
        body("name").trim().notEmpty().withMessage("name is required"),
        body("designation").trim().notEmpty().withMessage("designation is required"),
        body("company").optional().trim(),
        body("email").optional().trim().isEmail().withMessage("email must be valid"),
        body("mobileNumber").optional().trim(),
        body("website").optional().trim(),
        body("address").optional().trim()
    ]
};

const businessCardUpdateValidator = () => {
    return [
        body("name").optional().trim(),
        body("designation").optional().trim(),
        body("company").optional().trim(),
        body("email").optional().trim().isEmail().withMessage("email must be valid"),
        body("mobileNumber").optional().trim(),
        body("website").optional().trim(),
        body("address").optional().trim()
    ]
};

const brandCardValidator = () => {
    return [
        body("brandName").trim().notEmpty().withMessage("brandName is required"),
        body("tagline").optional().trim(),
        body("website").optional().trim(),
        body("logoUrl").optional().trim(),
        body("description").optional().trim()
    ]
};

const brandCardUpdateValidator = () => {
    return [
        body("brandName").optional().trim(),
        body("tagline").optional().trim(),
        body("website").optional().trim(),
        body("logoUrl").optional().trim(),
        body("description").optional().trim()
    ]
};

export {
    registerUserValidator,
    loginUserValidator,
    vehicleCardValidator,
    vehicleCardUpdateValidator,
    businessCardValidator,
    businessCardUpdateValidator,
    brandCardValidator,
    brandCardUpdateValidator,
};