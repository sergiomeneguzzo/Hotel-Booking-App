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
  getUnavailableDates,
} from './booking.controller';

const router = Router();

router.use(isAuthenticated);

router.post('/', createBooking);
router.get('user', getBookingsByUser);
router.get('/', getAllBookings);
router.get('/:bookingId', getBookingById);
router.patch('/:bookingId', updateBooking);
router.delete('/:bookingId', deleteBooking);
router.patch('/:bookingId/cancel', cancelBooking);
router.get('/unavailable-dates/:hotelId', getUnavailableDates);

export default router;
