//Encryption user password
const bcrypt = require('bcryptjs');

const encryption = async (data) => {
    const salt = bcrypt.genSaltSync(10); 
    const hash = bcrypt.hashSync(data, salt);
    return hash
}

//decode user password
const passwordValidate = async (newPassword , hash)=>{
    return bcrypt.compareSync(newPassword, hash);
}

module.exports = {
    encryption , 
    passwordValidate
} 