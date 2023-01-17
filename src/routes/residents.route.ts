import { Router } from 'express';
import {
  createResident,
  deleteResident,
  getResidents,
  updateResident,
} from '../controllers/residents.controller.js';
import modelValidation from '../middlewares/validateModel.middleware.js';
import { ResidentModel } from '../models/models.js';

const router = Router();

router.post('/residents', modelValidation(ResidentModel), createResident);

router.get('/residents', getResidents);

router.patch('/residents/:residentId', updateResident);

router.delete('/residents/:residentId', deleteResident);

export default router;
