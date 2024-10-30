import { NextFunction, Router, Request, Response } from 'express';
import {
  createHotelType,
  getHotelTypeById,
  updateHotelType,
  deleteHotelType,
  getAllHotelTypes,
} from './hotel-type.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';

const router = Router();

router.use(isAuthenticated);

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  createHotelType(req, res, next);
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getAllHotelTypes(req, res, next);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  getHotelTypeById(req, res, next);
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  updateHotelType(req, res, next);
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  deleteHotelType(req, res, next);
});

export default router;
