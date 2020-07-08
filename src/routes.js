import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

/**
 * Middlewares
 */

import authMiddleware from './app/middlewares/auth';
import signatureMiddleware from './app/middlewares/signature';

/**
 * Rotas de Usuários autenticados
 */

import SessionController from './app/controllers/sessionController';
import UserController from './app/controllers/UserController';
import RecipientsController from './app/controllers/recipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import StartDeliveryController from './app/controllers/StartDeliveryController';
import ListProblemController from './app/controllers/ListProblemsController';
import FileController from './app/controllers/FileController';
import SignatureController from './app/controllers/SignatureController';
import CancelDeliveryController from './app/controllers/CancelDeliveryController';

/** Rotas do entregador */

import EndDeliveryController from './app/controllers/EndDeliveryController';
import Schedule from './app/controllers/ScheduleController';
import Historic from './app/controllers/HistoricController';
import StartDeliveryman from './app/controllers/StartDeliverymanController';
import RegisterController from './app/controllers/RegisterProblem';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  res.json({ message: 'Hello Word!!!' });
});

routes.post('/session', SessionController.store);

routes.get('/schedule/:id/deliveries', Schedule.index);
routes.get('/historic/deliveries', Historic.index);
routes.put(
  '/startdeliveries/:deliveryman_id/:order_id',
  StartDeliveryman.store
);
routes.post(
  '/deliveryman/:deliveryman_id/delivery/:delivery_id',
  signatureMiddleware,
  EndDeliveryController.store
);

routes.post('/delivery/:delivery_id/problems', RegisterController.store);
routes.get('/delivery/:delivery_id/problems', ListProblemController.show);
routes.get('/deliverymen/:id', DeliverymanController.show);

routes.post('/signature', upload.single('file'), SignatureController.store);

routes.use(authMiddleware);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);
routes.get('/recipients', RecipientsController.index);
routes.delete('/recipients/:id', RecipientsController.delete);

routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);
routes.get('/deliverymen', DeliverymanController.index);

routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);
routes.get('/deliveries', DeliveryController.index);

routes.put('/startdelivery/:order_id', StartDeliveryController.store);

routes.get('/delivery/problems', ListProblemController.index);

routes.delete('/problem/:id/cancel-delivery', CancelDeliveryController.delete);

export default routes;
