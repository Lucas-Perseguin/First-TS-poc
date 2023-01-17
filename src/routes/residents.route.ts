import { Router } from 'express';
import {
  createResident,
  getResidents,
  updateResident,
} from '../controllers/residents.controller.js';
import modelValidation from '../middlewares/validateModel.middleware.js';
import { ResidentModel } from '../models/models.js';

const router = Router();

router.post('/residents', modelValidation(ResidentModel), createResident);

router.get('/residents', getResidents);

router.patch('/residents/:residentId', updateResident);

export default router;
