import { quizStore } from '../_store.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { id } = req.query;
  if (!id) {
    res.status(400).json({ message: '缺少问卷ID' });
    return;
  }

  const quizData = quizStore.get(id);
  if (!quizData) {
    res.status(404).json({ message: '问卷不存在' });
    return;
  }

  res.status(200).json(quizData);
}
