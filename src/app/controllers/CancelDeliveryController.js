import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Queue from '../../lib/Queue';
import CancelDeliveryMail from '../jobs/cancelDeliveryMail';

class CancelDeliveryController {
  async delete(req, res) {
    const problems = await DeliveryProblem.findByPk(req.params.id);

    if (!problems) {
      return res.status(400).json({ error: 'Invalid problem.' });
    }

    const delivery = await Delivery.findByPk(problems.delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    delivery.canceled_at = new Date();

    await delivery.save();

    await Queue.add(CancelDeliveryMail.key, { delivery });

    return res.send();
  }
}

export default new CancelDeliveryController();
