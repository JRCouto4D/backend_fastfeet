import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class RegisterProblemController {
  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { description, deliveryman_id } = req.body;

    const delivery = await Delivery.findByPk(req.params.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Invalid delivery.' });
    }

    if (delivery.deliveryman_id !== deliveryman_id) {
      return res.status(400).json({ error: 'Unauthorized action.' });
    }

    const problems = await DeliveryProblem.create({
      delivery_id: delivery.id,
      description,
    });

    return res.json(problems);
  }
}

export default new RegisterProblemController();
