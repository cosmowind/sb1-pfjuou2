import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'your-api-key-here';

export const generateResponse = async (messages: { role: string; content: string }[]) => {
  try {
    const response = await axios.post(API_URL, {
      model: "gpt-3.5-turbo",
      messages: messages,
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

export const generateSuggestedResponse = async (conversation: string) => {
  try {
    const response = await axios.post(API_URL, {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "你是一个助手，根据给定的对话历史生成一个简短的回复选项。" },
        { role: "user", content: `基于以下对话历史，生成一个简短的回复选项：\n\n${conversation}` },
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API for suggested response:', error);
    throw error;
  }
};