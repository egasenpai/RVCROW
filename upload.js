export const config = {
  api: {
    bodyParser: false
  }
};

import multiparty from 'multiparty';
import FormData from 'form-data';

export default async function handler(req, res) {
  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Parse failed' });

    const chat_id = fields.chat_id[0];
    const caption = fields.caption[0];
    const type = fields.type[0]; // 'photo' or 'video'
    const file = files.file[0];

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${token}/send${type === 'photo' ? 'Photo' : 'Video'}`;

    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append(type, require('fs').createReadStream(file.path));
    formData.append('caption', caption);

    try {
      await fetch(url, { method: 'POST', body: formData });
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
