const db = require("../models");
const {
  userSignature: UserSignature,
  signedDocument: SignedDocument,
  pendingDocument: PendingDocument,
} = db;
const { sendEmail } = require("../config/mailer");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.addDocumentToSign = (req, res) => {
  const data = req.body;
  // console.log("my data---", data);
  const pendingDocument = new PendingDocument({
    userId: data.userId,
    documentName: data.documentName,
    documentUrl: data.documentUrl,
    email: data.email,
    senderName: data.senderName,
    senderEmail: data.senderEmail,
    transactionReference: data.transactionReference,
    documentType: data.documentType,
    timeStamp: new Date(),
    status: data.status,
  });

  pendingDocument
    .save()
    .then(async (r) => {
      // console.log(r);
      let mailContent = `<p> Hi greetings from Angootha , <br><br> You have a new document to sign. </p>
                        <p>Details of document:</p>

                        <ul>
                          <li> Name : ${data.documentName} </li>
                          <li> Sent By : ${data.senderName} </li>
                          <li> Sender Email : ${data.senderEmail} </li>
                          <li> Document Url : ${data.documentUrl} </li>
                        </ul>

                        <p>Please click on the below link to see the documents pending for signature</p>
                        <a href='${process.env.react_app_url}/pending-documents'>${process.env.react_app_url}/pending-documents</a>

                        <h3> Thanks & Regards <br>  Team Angootha </h3>
          `;
      sendEmail(mailContent, data.email);
      res.status(200).send("document submitted successfully.");
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).send("document not submitted");
    });
};

exports.addSignature = (req, res) => {
  // console.log("my data---", req.body);
  const data = req.body;
  const userSignature = new UserSignature({
    username: data.userName,
    userId: data.userId,
    signatureName: data.signatureName,
    transactionHash: data.transactionHash,
    blockHash: data.blockHash,
    signatureUrl: data.signatureLink,
    timeStamp: new Date().toString(),
  });

  let mailContent = `<p> Hi greetings from Angootha , <br><br> You have successfully created a signature. </p>
  <p>Details regarding your signature:</p>

  <ul>
    <li> Name : ${data.signatureName} </li>
    <li> Transaction Hash : ${data.transactionHash} </li>
    <li> Signature Url : ${data.signatureLink} </li>
    <li> Block Hash : ${data.blockHash} </li>
  </ul>

  <h3> Thanks & Regards <br>  Team Angootha </h3>

    `;

  userSignature
    .save()
    .then(async (r) => {
      console.log(r);
      const mail_data = await sendEmail(mailContent, data.email);
      res.status(200).send({ msg: "Signature added successfully.", mail_data });
    })
    .catch((err) => {
      console.log(err);
      res.status(300).send("Signature creation failed");
    });
};
exports.addSignedDocument = (req, res) => {
  // console.log("my data---", req.body);
  const data = req.body;
  const signedDocument = new SignedDocument({
    signerName: data.signerName,
    signerId: data.signerId,
    signatureName: data.signatureName,
    signatureBlockHash: data.signatureBlockHash,
    signatureTransactionHash: data.signatureTransactionHash,
    signedDocumentName: data.documentName,
    transactionHash: data.transactionHash,
    blockHash: data.blockHash,
    status: data.status,
    timeStamp: new Date().toString(),
  });

  signedDocument
    .save()
    .then((r) => {
      // console.log(r);
      let mailContent = `<p> Hi greetings from Angootha , <br><br> You have successfully signed a document. </p>
                        <p>Details of document:</p>

                        <ul>
                          <li> Name : ${data.documentName} </li>
                          <li> Signature Used : ${data.signatureName} </li>
                          <li> Transaction Hash : ${data.transactionHash} </li>
                        </ul>

                        <h3> Thanks & Regards <br>  Team Angootha </h3>
          `;
      sendEmail(mailContent, data.email);
      res.status(200).send("document signed successfully.");
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).send("document Sign failed");
    });
};

exports.getSignatures = async (req, res) => {
  await UserSignature.find({ userId: req.body.userId }, (err, data) => {
    if (err) {
      // console.log(err);
      res.status(400).send("Data not found");
    }
    if (data) {
      // console.log(data);
      res.status(200).send(data);
    }
  })
    .clone()
    .catch(function (err) {
      // console.log(err);
      res.status(400).send("Data not found");
    });
};
exports.getDocuments = async (req, res) => {
  await PendingDocument.find(
    {
      $or: [
        {
          userId: req.body.userId,
        },
        {
          email: req.body.email,
        },
      ],
    },
    (err, data) => {
      if (err) {
        // console.log(err);
        res.status(400).send("Data not found");
      }
      if (data) {
        // console.log(data);
        res.status(200).send(data);
      }
    }
  )
    .clone()
    .catch(function (err) {
      // console.log(err);
      res.status(400).send("Data not found");
    });
};

exports.updateDocument = async (req, res) => {
  data = req.body;
  PendingDocument.updateOne(
    { _id: data.documentId },
    { status: data.status },
    (err, data) => {
      if (err) {
        // console.log(err);
        res.status(500).send(err);
      }
      // console.log(data);
      res.status(200).send(data);
    }
  );
};

exports.deleteDocument = async (req, res) => {
  data = req.body;
  PendingDocument.deleteOne({ _id: data.documentId }, (err, data) => {
    if (err) {
      // console.log(err);
      res.status(500).send(err);
    }
    // console.log(data);
    res.status(200).send(data);
  });
};
