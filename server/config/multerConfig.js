import multer from 'multer';

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith('image') ||
        file.mimetype === 'application/pdf'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only image files and PDFs are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
