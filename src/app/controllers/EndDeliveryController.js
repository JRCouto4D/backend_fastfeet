import Delivery from '../models/Delivery';

class EndDeliveryController {
  async store(req, res) {
    const { delivery_id } = req.params;
    const { signature_id } = req.body;

    const delivery = await Delivery.findByPk(delivery_id);

    const newDelivery = await delivery.update({
      end_date: new Date(),
      signature_id,
    });

    return res.json(newDelivery);
  }
}

export default new EndDeliveryController();
