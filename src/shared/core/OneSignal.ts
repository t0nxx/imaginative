import axios from 'axios';
import env from './Environment';

function sendNotification(email: string, header: string, body: string) {
  return axios.post(
    'https://onesignal.com/api/v1/notifications',
    {
      app_id: env.ONESIGNAL_APP_ID,
      filters: [{ field: 'email', key: email, value: email }],
      headings: { en: header },
      contents: { en: body },
    },
    {
      headers: { Authorization: `Basic ${env.ONESIGNAL_API_KEY}` },
    },
  );
}

export function sendWelcomeNotification(email: string) {
  return sendNotification(email, 'English Header', 'English Message');
}
