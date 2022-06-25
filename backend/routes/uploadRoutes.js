import path from 'path'
import express from 'express'
import multer from 'multer';
import { storage } from '../../firebase.js';
import { ref, getDownloadURL, uploadBytes, uploadBytesResumable } from "firebase/storage";

const router = express.Router()

const filestorage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads/')
	},
	filename(req, file, cb) {
		cb(
			null,
			// Set file name to
			// filename-Date.now().extension
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		)
	},
})

function checkFileType(file, cb) {
	// Accepted file types
	const filetypes = /jpg|jpeg|png/

	// Check if upload file type matches with accepted file types
	const extName = filetypes.test(
		path.extname(file.originalname).toLocaleLowerCase()
	)

	const mimetype = filetypes.test(file.mimetype)
	if (extName && mimetype) {
		return cb(null, true)
	} else {
		cb('Images only!')
	}
}

const upload = multer({
	storage: multer.memoryStorage(),
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb)
	},
})

const uploadCloudImage = (req, res) => {
	const file = req.file;
	const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
	const imageRef = ref(storage, 'uploads/'+ filename);
	const metatype = { contentType: file.mimetype, name: filename };
	
	return uploadBytes(imageRef, file.buffer, metatype)
		.then(snapshot => getDownloadURL(imageRef))
		.then(url => {
			console.log('url', url);
			res.send(url);
		})
		.catch((error) => console.log('err', error.message));
	
}

router.post('/', upload.single('image'), (req, res) => {
	uploadCloudImage(req, res);
})

export default router
