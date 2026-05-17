import { quizStore } from './_store.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { id, quizData } = req.body;
  if (!id || !quizData) {
    res.status(400).json({ message: '缺少必要参数' });
    return;
  }

  quizStore.set(id, quizData);
  res.status(200).json({ message: '问卷保存成功', id });
}
