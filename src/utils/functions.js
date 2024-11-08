const HandleData = (e) => {
  if (
    e.fullName !== "" &&
    e.email !== "" &&
    e.phoneNumber !== "" &&
    e.age !== "" &&
    e.gender !== "" &&
    e.camperType !== "" &&
    e.denomination === "Anglican" &&
    e.archdeaconry !== "" &&
    e.parish !== null &&
    e.paymentOption !== ""
  ) {
    return false;
  } else if (
    e.fullName !== "" &&
    e.email !== "" &&
    e.phoneNumber !== "" &&
    e.age !== "" &&
    e.gender !== "" &&
    e.denomination !== "" &&
    e.camperType !== "" &&
    e.denomination === "Non-Anglican"
  ) {
    return false;
  } else {
    return true;
  }
};
export { HandleData };
