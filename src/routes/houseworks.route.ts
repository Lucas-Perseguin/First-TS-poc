import { Router } from 'express';
import {
  completeHousework,
  createHousework,
  delteHousework,
  editHousework,
  getHouseworks,
} from '../controllers/houseworks.controller.js';
import checkResidentActivity from '../middlewares/checkResidentActivity.middleware.js';
import modelValidation from '../middlewares/validateModel.middleware.js';
import { HouseworkEditModel, HouseworkModel } from '../models/models.js';

const router = Router();

router.post(
  '/houseworks/:residentId',
  modelValidation(HouseworkModel),
  checkResidentActivity,
  createHousework
);

router.get('/houseworks', getHouseworks);

router.post('/houseworks/:houseworkId/complete', completeHousework);

router.patch(
  '/houseworks/:houseworkId',
  modelValidation(HouseworkEditModel),
  editHousework
);

router.delete('/houseworks/:houseworkId', delteHousework);

export default router;
