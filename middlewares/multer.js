import multer from "multer";

const storage = multer.memoryStorage();

const singleUpload = multer({ limits: { fileSize: 50 * 1024 * 1024, files: 1 }, storage }).single("file");

export default singleUpload;
