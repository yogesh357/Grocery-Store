import express from 'express';
import { subscribe, unsubscribe } from '../controllers/subscriberController.js';

const subscriberRouter = express.Router();

subscriberRouter.post('/subscribe', subscribe);
subscriberRouter.get('/unsubscribe', unsubscribe);

export default subscriberRouter;
