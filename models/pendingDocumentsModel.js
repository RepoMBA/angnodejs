const mongoose = require("mongoose");
const PendingDocument = mongoose.model(
  "PendingDocument",
  new mongoose.Schema({
    userId: String,
    documentName: String,
    status: String,
    timeStamp: String,
    documentUrl: String,
    email: String,
    senderName: String,
    senderEmail: String,
    documentType: String,
    transactionReference: String,
  })
);
module.exports = PendingDocument;
