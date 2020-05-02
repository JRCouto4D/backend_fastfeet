import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancelDeliveryMail {
  get key() {
    return 'CancelDeliveryMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Entrega cancelada pela transportadora',
      template: 'canceldelivery',
      context: {
        deliveryman: delivery.deliveryman.name,
        delivery_id: delivery.id,
        date: format(
          parseISO(delivery.canceled_at),
          "'dia' dd 'de' MMMM,' às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancelDeliveryMail();
