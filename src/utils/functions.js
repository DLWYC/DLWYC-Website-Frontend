// const HandleErrors = (e) => {
//      const errors = {};
   
//      if (e.fullName === "") {
//        errors["fullName"] = "Please Enter Your Full-Name";
//      } else if (e.email === "") {
//        errors["email"] = "Please Enter Your Email";
//      } else if (e.phoneNumber === "") {
//        errors["phoneNumber"] = "Please Enter Your Phone Number";
//      } else if (e.age === "") {
//        errors["age"] = "Please Enter Your Age";
//      } else if (e.gender === "") {
//        errors["gender"] = "Please Enter Your Gender";
//      } else if (e.denomination === "") {
//        errors["email"] = "Please Enter Your Email";
//      }
   
//      return errors;
//    };

const HandleData = (e) => {
     console.log(e.denomination)
     if((e.fullName !== "" && e.email !== "" && e.phoneNumber !== "" && e.age !== "" && e.gender !== "" && e.camperType !== "" && e.denomination === "Anglican")
          && e.archdeaconry !== "" && e.parish !== null && e.paymentOption !== ""
     ){
          return(false)
     }
    else if ((e.fullName !== "" && e.email !== "" && e.phoneNumber !== "" && e.age !== "" && e.gender !== "" && e.denomination !== "" && e.camperType !== "") && e.denomination === "Non-Anglican" ){
          return(false)
     }
     else{
          return(true)
     }
     }
   export  {HandleData};
   