import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryProblemController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      attributes: ['description', 'created_at'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['product', 'start_date'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['name', 'state', 'zip_code'],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['name', 'email'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['name', 'path', 'url'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!problems) {
      return res
        .status(401)
        .json({ error: 'There is no record of problems in deliveries.' });
    }

    return res.json(problems);
  }

  async show(req, res) {
    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.delivery_id,
      },
      attributes: ['description', 'created_at'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['product', 'start_date'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['name', 'state', 'zip_code'],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['name', 'email'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['name', 'path', 'url'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!problems) {
      return res
        .status(400)
        .json({ error: 'There is no record of problems in deliveries.' });
    }

    return res.json(problems);
  }
}

export default new DeliveryProblemController();
