import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryProblemController {
  async delete(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.id);

    if (!problem) {
      return res.status(401).json({ error: 'Problem invalided' });
    }

    await problem.destroy();

    return res.send();
  }

  async index(req, res) {
    const total = await DeliveryProblem.count();
    const { page = 1 } = req.query;

    const problems = await DeliveryProblem.findAll({
      attributes: ['id', 'description', 'created_at'],
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product', 'start_date'],
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

    return res.json({ problems, total });
  }

  async show(req, res) {
    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.delivery_id,
      },
      attributes: ['id', 'description', 'created_at'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product', 'start_date'],
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
