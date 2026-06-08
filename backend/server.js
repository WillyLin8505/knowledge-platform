import express from 'express';
import cors from 'cors';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `你是一位專業的知識導師，擅長將複雜領域的專有名詞用淺顯易懂的方式解釋給初學者。
只輸出純 JSON，不要任何 markdown、說明文字或 code block。

JSON 格式：
{
  "topic": "主題名稱",
  "categories": [
    {
      "name": "分類名稱",
      "description": "分類說明",
      "terms": [
        {
          "term": "中文名稱",
          "english": "English Name",
          "explanation": "簡單解釋",
          "example": "實際例子"
        }
      ]
    }
  ]
}`;

function extractJson(text) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

app.post('/api/analyze', async (req, res) => {
  const { topic } = req.body;
  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    return res.status(400).json({ error: '請提供有效的學習主題' });
  }

  try {
    const userPrompt = `請幫我分析「${topic.trim()}」這個學習領域所需要了解的重要專有名詞。
要求：
1. 將專有名詞依照概念類型分成 3~6 個分類
2. 每個分類包含 3~6 個最重要的名詞
3. 每個名詞提供：中文名稱、英文原名、簡單易懂的解釋（一兩句話）、實際應用例子
4. 解釋要以完全沒有該領域背景的初學者為對象`;

    const { stdout } = await execFileAsync('claude', [
      '-p', userPrompt,
      '--system-prompt', SYSTEM_PROMPT,
      '--output-format', 'json',
      '--no-session-persistence',
      '--model', 'claude-opus-4-8',
    ], { maxBuffer: 10 * 1024 * 1024, timeout: 120000 });

    const cliOutput = JSON.parse(stdout);
    if (cliOutput.is_error) throw new Error(cliOutput.result);

    const jsonText = extractJson(cliOutput.result);
    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
