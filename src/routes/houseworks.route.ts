import { Router } from 'express';

const router = Router();

router.post('/houseworks/:residentId');

router.get('/houseworks');

router.get('/houserworks/:residentId');

router.patch('/houseworks/:houseworkId');

router.delete('/houseworks/:houseworkId');

export default router;
