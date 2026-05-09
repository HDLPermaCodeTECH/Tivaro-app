import { Router } from 'express';
import * as productController from './product.controller';
import { authenticate } from '../../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Siguraduhing existing ang upload directory
fs.mkdirSync('public/uploads', { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const router = Router();

router.use(authenticate);

router.get('/', productController.getProducts);
router.post('/', upload.single('image'), productController.createProduct);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
