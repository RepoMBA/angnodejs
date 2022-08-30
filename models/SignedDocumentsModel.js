const mongoose = require("mongoose");
const SignedDocument = mongoose.model(
  "SignedDocument",
  new mongoose.Schema({
    signerName: String,
    signerId: String,
    signatureName: String,
    signatureBlockHash: String,
    signatureTransactionHash: String,
    signedDocumentName: String,
    transactionHash: String,
    blockHash: String,
    status: String,
    timeStamp: String,
  })
);
module.exports = SignedDocument;
