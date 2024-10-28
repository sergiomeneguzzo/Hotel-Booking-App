import { Router } from 'express';
import {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} from './hotel.controller';
import { Request, Response, NextFunction } from 'express';
import { upload } from '../../utils/upload';

const router = Router();

router.post(
  '/',
  upload.array('uploads', 5),
  (req: Request, res: Response, next: NextFunction) => {
    createHotel(req, res, next);
  },
);
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getAllHotels(req, res, next);
});
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  getHotelById(req, res, next);
});
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  updateHotel(req, res, next);
});
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  deleteHotel(req, res, next);
});

export default router;
