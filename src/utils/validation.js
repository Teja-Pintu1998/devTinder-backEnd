const validateSignupData = (req)=>{
const {firstName,lastName,emailId,password} = req.body;
if(!firstName || !lastName){
    throw new Error("first name or last name missing")
}
//write all logic to valitate data

}

module.exports = {validateSignupData}