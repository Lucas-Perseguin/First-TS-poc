import { Router } from 'express';
import { createHousework } from '../controllers/houseworks.controller.js';
import checkResidentActivity from '../middlewares/checkResidentActivity.middleware.js';
import modelValidation from '../middlewares/validateModel.middleware.js';
import { HouseworkModel } from '../models/models.js';

const router = Router();

router.post(
  '/houseworks/:residentId',
  modelValidation(HouseworkModel),
  checkResidentActivity,
  createHousework
);

router.get('/houseworks');

router.get('/houserworks/:residentId');

router.patch('/houseworks/:houseworkId');

router.delete('/houseworks/:houseworkId');

export default router;
