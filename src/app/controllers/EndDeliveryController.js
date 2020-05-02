import Signature from '../models/Signature';
import Delivery from '../models/Delivery';

class EndDeliveryController {
  async store(req, res) {
    const { delivery_id } = req.query;

    const delivery = await Delivery.findByPk(delivery_id);

    const { originalname: name, filename: path } = req.file;
    const { id } = await Signature.create({
      name,
      path,
    });

    delivery.end_date = new Date();

    delivery.signature_id = id;

    await delivery.save();

    return res.json(delivery);
  }
}

export default new EndDeliveryController();
