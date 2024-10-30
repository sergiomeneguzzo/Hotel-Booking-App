import { Router } from 'express';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import bookingRouter from './booking/booking.router';
import hotelRouter from './hotel/hotel.router';
import hotelTypeRouter from './hotel-type/hotel-type.router';
import amenitiesRouter from './amenities/amenities.router';

const router = Router();

router.use('/users', userRouter);
router.use('/booking', bookingRouter);
router.use('/hotels', hotelRouter);
router.use('/hotel-types', hotelTypeRouter);
router.use('/amenities', amenitiesRouter);
router.use(authRouter);

export default router;
