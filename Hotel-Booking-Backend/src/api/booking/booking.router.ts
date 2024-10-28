import { Router } from 'express';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';
import {
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByUser,
  getAllBookings,
  cancelBooking,
} from './booking.controller';
import { Request, Response, NextFunction } from 'express';

const router = Router();

router.use(isAuthenticated);

//router.post('/', createBooking )

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  createBooking(req, res, next);
});
router.get('/user', (req: Request, res: Response, next: NextFunction) => {
  getBookingsByUser(req, res, next);
});
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getAllBookings(req, res, next);
});
router.get('/:bookingId', (req: Request, res: Response, next: NextFunction) => {
  getBookingById(req, res, next);
});
router.patch(
  '/:bookingId',
  (req: Request, res: Response, next: NextFunction) => {
    updateBooking(req, res, next);
  },
);
router.delete(
  '/:bookingId',
  (req: Request, res: Response, next: NextFunction) => {
    deleteBooking(req, res, next);
  },
);
router.patch(
  '/:bookingId/cancel',
  (req: Request, res: Response, next: NextFunction) => {
    cancelBooking(req, res, next)
      .then((result) => res.json(result))
      .catch(next);
  },
);

export default router;
