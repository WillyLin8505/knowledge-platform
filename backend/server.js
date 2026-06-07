import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    topic: { type: 'string' },
    categories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          terms: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                term: { type: 'string' },
                english: { type: 'string' },
                explanation: { type: 'string' },
                example: { type: 'string' },
              },
              required: ['term', 'explanation'],
              additionalProperties: false,
            },
          },
        },
        required: ['name', 'terms'],
        additionalProperties: false,
      },
    },
  },
  required: ['topic', 'categories'],
  additionalProperties: false,
};

app.post('/api/analyze', async (req, res) => {
  const { topic } = req.body;
  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    return res.status(400).json({ error: '請提供有效的學習主題' });
  }

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      thinking: { type: 'adaptive' },
      system:
        '你是一位專業的知識導師，擅長將複雜領域的專有名詞用淺顯易懂的方式解釋給初學者。請依照 JSON schema 格式輸出，不要輸出其他文字。',
      messages: [
        {
          role: 'user',
          content: `請幫我分析「${topic.trim()}」這個學習領域所需要了解的重要專有名詞。
要求：
1. 將專有名詞依照概念類型分成 3~6 個分類
2. 每個分類包含 3~6 個最重要的名詞
3. 每個名詞提供：中文名稱、英文原名、簡單易懂的解釋（一兩句話）、實際應用例子
4. 解釋要以完全沒有該領域背景的初學者為對象`,
        },
      ],
      output_config: {
        format: {
          type: 'json_schema',
          name: 'knowledge_analysis',
          schema: OUTPUT_SCHEMA,
        },
      },
    });

    const message = await stream.finalMessage();
    const text = message.content.find((b) => b.type === 'text')?.text ?? '{}';
    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '分析失敗，請稍後再試' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
