const mongoose = require("mongoose");
const UserSignature = mongoose.model(
  "UserSignature",
  new mongoose.Schema({
    username: String,
    signatureName: String,
    userId: String,
    signatureUrl: String,
    transactionHash: String,
    blockHash: String,
    timeStamp: String,
  })
);
module.exports = UserSignature;
// module.exports =  mongoose.model('UserSchema', UserSignature)
