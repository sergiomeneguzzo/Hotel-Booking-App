import { Router } from 'express';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import bookingRouter from './booking/booking.router';

const router = Router();

router.use('/users', userRouter);
router.use('/booking', bookingRouter);
router.use(authRouter);

export default router;
