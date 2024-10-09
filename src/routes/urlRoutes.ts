import { Router } from 'express';
import {
  urlShorten,
  getStats,
  redirectUrl,
  createCustomUrl,
} from '../controllers/urlController';
import { cacheMiddleware } from '../middlewares/cacheMiddleware';

const router = Router();

router.route('/shorten').post(urlShorten);
router.route('/customShorten').post(createCustomUrl);
router.route('/:shortUrl').get(cacheMiddleware, redirectUrl);
router.route('/stats/:shortUrl').get(getStats);

export default router;
