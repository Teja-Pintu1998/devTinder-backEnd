const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("first name or last name missing")
    }
    //write all logic to valitate data

}


//The every() method checks if all keys present in the request body are part of the allowedEditFields array. It does not require that every field in allowedEditFields be present in the body.
const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoURL", "gender", "age", "about", "skills"];
    const isEditAllowed = Object.keys(req.body).every((field)=>{
       return allowedEditFields.includes(field)
    })

    //console.log(req.user)

    return isEditAllowed;

}

module.exports = { validateSignupData, validateProfileEditData}