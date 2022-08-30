const ipfsAPI = require("ipfs-api");
const ipfsClient = require("ipfs-http-client");
let multer = require("multer");
let path = require("path");
let fs = require("fs");

const projectId = "2DIc2TtJE84lNOxWz5LbIgWveM2"; // <---------- your Infura Project ID

const projectSecret = "c6944eb95cc80287c61742c071925d75"; // <---------- your Infura Secret

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

// const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });
const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

// setting storage location and name of file getting from client-side
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `publicFiles`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

let upload = multer({ storage: storage }).single("file");

module.exports = (req, res) => {
  // uploading file in mentioned folder

  // create a publicFiles folder if not exists
  pfdir = path.resolve(__dirname, "../publicFiles");
  if (!fs.existsSync(pfdir)) {
    fs.mkdirSync(pfdir);
  }

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    scanFileName = req.file.originalname;
    console.log("data ---", scanFileName);
    console.log("456", req.file.originalname);

    if (req.file.originalname) {
      const response = await uploadFile(req.file.originalname);
      console.log("response---=", response);
      if (response) {
        return res.status(200).send(response);
      } else {
        return res.status(300).send("File upload failed");
      }
    }
  });
};

const uploadFile = async (file_name) => {
  pdfFilePath = path.resolve(__dirname, `../publicFiles/${file_name}`);
  const file = fs.readFileSync(pdfFilePath);
  let fileBuffer = new Buffer.from(file);

  let output_data = "";

  const fileadded = await ipfs.add({ path: file_name, content: fileBuffer });
  console.log("hash", fileadded.cid);
  fs.rmSync(pdfFilePath, { recursive: true });
  if (fileadded) {
    output_data = {
      hash: fileadded.cid.toString().substring(3, 50),
    };
    console.log(output_data);
    return output_data;
  } else {
    return;
  }

  // await ipfs.files
  //   .add(fileBuffer)
  //   .then((res) => {
  //     console.log("res--", res);
  //     output_data = res;
  //     console.log("output_data", output_data);
  //     //   return res;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  fs.rmSync(pdfFilePath, { recursive: true });
  return output_data;
};
