import express from 'express'
import imageToBase64 from 'image-to-base64'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const storage = multer.diskStorage({
	destination: (_, __, callback) => {
		callback(null, 'uploads')
	},
	filename: (_, file, callback) => {
		callback(null, file.originalname)
	},
})

const upload = multer({ storage })

app.post('/url', async (req, res) => {
	try {
		const base64 = await imageToBase64(req.body.image)
		res.json(base64)
	} catch (err) {
		res.status(500).json({message: 'error'})
	}
})

app.post('/image', upload.single('image'), async (req, res) => {
	try {
		const base64 = await imageToBase64('./uploads/' + req.file.originalname)
		fs.rm('./uploads/' + req.file.originalname, { recursive: true }, err => {
			if (err) {
				res.status(500).json({ message: 'Server error', base64 })
			}
		})
		res.json(base64)
	} catch (error) {
		res.status(500).json({message: 'error'})
	}
})

app.listen(process.env.PORT, () => console.log('Server UP'))
