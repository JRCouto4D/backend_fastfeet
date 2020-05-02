import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Signature from '../models/Signature';

class HistoricController {
  async index(req, res) {
    const checkDeliveryman = await Deliveryman.findByPk(req.params.id);

    if (!checkDeliveryman) {
      return res.status(400).json({ error: 'Delivery man does not exist' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
      },
      attributes: ['product', 'start_date', 'end_date'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'state', 'city', 'zip_code'],
        },
        {
          model: Signature,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    const completedDelivery = deliveries.filter(
      delivery => delivery.end_date !== null
    );

    if (!completedDelivery) {
      return res.status(401).json({ error: 'No complete deliveries.' });
    }

    return res.json(completedDelivery);
  }
}

export default new HistoricController();
