const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const uploadFileToIPFS = require("../controllers/uploadFileToIPFS");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post("/api/signature/uploadFileToIpfs", uploadFileToIPFS);
  app.post("/api/signature/addSignature", controller.addSignature);
  app.post("/api/signature/getSignatures", controller.getSignatures);
  app.post("/api/signature/addSignedDocument", controller.addSignedDocument);
  app.post("/api/signature/getDocuments", controller.getDocuments);
  app.post("/api/signature/updateDocument", controller.updateDocument);
  app.post("/api/signature/deleteDocument", controller.deleteDocument);
  app.post("/api/signature/addDocumentToSign", controller.addDocumentToSign);
};
