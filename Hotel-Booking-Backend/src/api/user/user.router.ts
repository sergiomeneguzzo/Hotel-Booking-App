import { Router } from 'express';
import {
  confirmEmail,
  me,
  updatePassword,
  updateProfilePicture,
} from './user.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';

const router = Router();

router.get('/me', isAuthenticated, me);
router.post('/email-confirmation', (req, res, next) => {
  confirmEmail(req, res, next).catch(next);
});
router.patch('/updatePassword', isAuthenticated, updatePassword);
router.patch('/update-profile-picture', isAuthenticated, (req, res, next) => {
  updateProfilePicture(req, res, next).catch(next);
});

export default router;
