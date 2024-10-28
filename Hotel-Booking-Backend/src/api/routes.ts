import { Router } from 'express';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import bookingRouter from './booking/booking.router';
import hotelRouter from './hotel/hotel.router';

const router = Router();

router.use('/users', userRouter);
router.use('/booking', bookingRouter);
router.use('/hotels', hotelRouter);
router.use(authRouter);

export default router;
