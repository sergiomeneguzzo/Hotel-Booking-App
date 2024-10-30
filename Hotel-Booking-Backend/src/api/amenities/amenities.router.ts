import { Router } from 'express';
import {
  createAmenity,
  getAllAmenities,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
} from './amenities.controller';
import { Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  createAmenity(req, res, next);
});
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getAllAmenities(req, res, next);
});
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  getAmenityById(req, res, next);
});
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  updateAmenity(req, res, next);
});
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  deleteAmenity(req, res, next);
});

export default router;
