const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// AI Model mappings
const AI_MODELS = {
    Claude: {
        model: 'claude-opus-4-1',
        apiKey: 'ANTHROPIC_API_KEY',
        endpoint: 'https://api.anthropic.com/v1/messages',
        headers: {
            'anthropic-version': '2023-06-01'
        }
    },
    ChatGPT: {
        model: 'gpt-4',
        apiKey: 'OPENAI_API_KEY',
        endpoint: 'https://api.openai.com/v1/chat/completions'
    },
    DeepSeek: {
        model: 'deepseek-chat',
        apiKey: 'DEEPSEEK_API_KEY',
        endpoint: 'https://api.deepseek.com/v1/chat/completions'
    },
    Mistral: {
        model: 'mistral-large',
        apiKey: 'MISTRAL_API_KEY',
        endpoint: 'https://api.mistral.ai/v1/chat/completions'
    }
};

// API endpoint to call Claude
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, ai = 'Claude' } = req.body;
        const aiConfig = AI_MODELS[ai] || AI_MODELS['Claude'];
        const apiKey = process.env[aiConfig.apiKey];

        if (!apiKey) {
            return res.status(400).json({ 
                error: `API key not configured for ${ai}. Set ${aiConfig.apiKey} in .env` 
            });
        }

        let response;

        if (ai === 'Claude') {
            response = await callClaude(messages, apiKey);
        } else if (ai === 'ChatGPT') {
            response = await callOpenAI(messages, apiKey);
        } else if (ai === 'DeepSeek') {
            response = await callDeepSeek(messages, apiKey);
        } else if (ai === 'Mistral') {
            response = await callMistral(messages, apiKey);
        } else {
            return res.status(400).json({ error: `Unknown AI: ${ai}` });
        }

        res.json({ content: response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

async function callClaude(messages, apiKey) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-opus-4-1',
            max_tokens: 500,
            messages: messages
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

async function callOpenAI(messages, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            max_tokens: 500,
            messages: messages
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callDeepSeek(messages, apiKey) {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            max_tokens: 500,
            messages: messages
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callMistral(messages, apiKey) {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'mistral-large',
            max_tokens: 500,
            messages: messages
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Supporting: Claude, ChatGPT, DeepSeek, Mistral`);
});
