import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class ScheduleController {
  async index(req, res) {
    const delivery = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
        end_date: null,
        canceled_at: null,
      },
      attributes: ['product', 'start_date'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'neighborhood',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
      ],
    });

    if (!delivery) {
      return res.status(401).json({ error: 'You have no deliveries.' });
    }

    return res.json(delivery);
  }
}

export default new ScheduleController();
