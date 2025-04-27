import * as Yup from "yup";

export const ValidationType = (controlType, validationObj) => {
  if (controlType === "normal") {
    let yupInstance = Yup.string().trim("Can't contain only space.");
    if ((validationObj.type = "normal")) {
      if (validationObj.required) {
        yupInstance = yupInstance.required("Field can't be empty");
      }
      if (validationObj.max) {
        yupInstance = yupInstance.max(
          validationObj.max,
          `Your input exceeds the maximum allowed character limit of ${validationObj.max}`
        );
      }
    }
    return yupInstance;
  }
};
