import * as Constants from "./constants";
import * as Patterns from "./patterns";

const isEmailValid = (val, minVal, maxVal, isRequired) => {
  if (isRequired && (val === "" || !val)) {
    return Constants.FIELD_REQUIRED;
  }

  if (val !== "" && val !== null) {
    if (val.match(Patterns.EMAIL_PATTERN) === null) {
      return Constants.EMAIL_NOT_VALID;
    }
  }

  if (minVal && val.length < minVal) {
    return Constants.VALUE_TOO_SHORT;
  }

  if (maxVal && val.length > maxVal) {
    return Constants.VALUE_TOO_LONG;
  }

  return "";
};

const isNameValid = (val, isRequired) => {
  if (isRequired && (val === "" || !val)) {
    return Constants.FIELD_REQUIRED;
  }

  if (val !== "" && val.match(Patterns.NAME_PATTERN) === null) {
    return Constants.INVALID_VALUE;
  }

  return "";
};

const isNameWithoutSpaceValid = (val, isRequired) => {
  if (isRequired && (val === "" || !val)) {
    return Constants.FIELD_REQUIRED;
  }

  if (val !== "" && val.match(Patterns.NAME_PATTERN_WITHOUT_SPACE) === null) {
    return Constants.INVALID_VALUE;
  }

  return "";
};

const isPasswordValid = (val, minVal, maxVal, isRequired) => {
  if (isRequired && (val === "" || !val)) {
    return Constants.FIELD_REQUIRED;
  }

  if (minVal && val.length < minVal) {
    return Constants.VALUE_TOO_SHORT;
  }

  if (maxVal && val.length > maxVal) {
    return Constants.VALUE_TOO_LONG;
  }

  return "";
};

const isConfirmValid = (val1, val2, minVal, maxVal, isRequired) => {
  if (isRequired && (val1 === "" || !val1)) {
    return Constants.FIELD_REQUIRED;
  }

  if (val1 !== val2) {
    return Constants.CONFRIM_MATCH;
  }

  return "";
};

const isTitleValid = (val, min, max, isRequired) => {
  if (isRequired && (val === "" || !val)) {
    return Constants.FIELD_REQUIRED;
  }
  if (min && val.length < min) {
    return Constants.VALUE_TOO_SHORT;
  }

  if (max && val.length > max) {
    return Constants.VALUE_TOO_LONG;
  }

  if (min && val.length < min) {
    return Constants.VALUE_TOO_SHORT;
  }

  if (max && val.length > max) {
    return Constants.VALUE_TOO_LONG;
  }

  return "";
};

const isResetPasswordValid = (val, minVal, isRequired) => {
  let passObj = {
    special: false,
    digit: false,
    upper: false,
    lower: false,
    min: false,
  };

  if (isRequired && (val === "" || !val)) {
    passObj.special = false;
    passObj.lower = false;
    passObj.upper = false;
    passObj.min = false;
    passObj.digit = false;
    //   return Constants.FIELD_REQUIRED;
  }
  minVal && val.length > minVal ? (passObj.min = true) : (passObj.min = false);

  if (val !== "" && val !== null) {
    Patterns.UPPERCASE_PATTERN.test(val)
      ? (passObj.upper = true)
      : (passObj.upper = false);
    Patterns.LOWERCASE_PATTERN.test(val)
      ? (passObj.lower = true)
      : (passObj.lower = false);
    Patterns.DIGIT_PATTERN.test(val)
      ? (passObj.digit = true)
      : (passObj.digit = false);
    Patterns.SPECIAL_PATTERN.test(val)
      ? (passObj.special = true)
      : (passObj.special = false);
  }

  return passObj;
};

export const Validator = {
  validate: (
    fieldType,
    fieldValue,
    minVal = null,
    maxVal = null,
    isRequired = true
  ) => {
    switch (fieldType) {
      case "email":
        return isEmailValid(fieldValue, minVal, maxVal, isRequired);
      case "password":
        return isPasswordValid(fieldValue, minVal, maxVal, isRequired);
      case "name":
        return isNameValid(fieldValue, isRequired);
      case "namewithoutspace":
        return isNameWithoutSpaceValid(fieldValue, isRequired)
      case "confirm":
        return isConfirmValid(fieldValue, minVal, maxVal, isRequired);
      case "title":
        return isTitleValid(fieldValue, minVal, maxVal, isRequired);
      case "resetpass":
        return isResetPasswordValid(fieldValue, minVal, isRequired);
      default:
        return "";
    }
  },
};
