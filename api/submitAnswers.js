import { answersStore } from './_store.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { quizId, answers } = req.body;
  if (!quizId || !answers) {
    res.status(400).json({ message: '缺少必要参数' });
    return;
  }

  answersStore.push({ quizId, answers, submittedAt: new Date().toISOString() });
  res.status(200).json({ message: '答案提交成功' });
}
