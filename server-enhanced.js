// Multi-AI Backend with Analytics & Error Handling
// Supports: Claude, ChatGPT, DeepSeek, Mistral

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Analytics
const analytics = {
  totalRequests: 0,
  requestsByAI: { Claude: 0, ChatGPT: 0, DeepSeek: 0, Mistral: 0 },
  errorCount: 0,
  averageResponseTime: 0,
  uptime: Date.now()
};

// AI Configuration
const AI_MODELS = {
  Claude: {
    model: 'claude-opus-4-1',
    apiKey: process.env.ANTHROPIC_API_KEY,
    endpoint: 'https://api.anthropic.com/v1/messages',
    provider: 'Anthropic',
    maxTokens: 100000
  },
  ChatGPT: {
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY,
    endpoint: 'https://api.openai.com/v1/chat/completions',
    provider: 'OpenAI',
    maxTokens: 120000
  },
  DeepSeek: {
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    provider: 'DeepSeek',
    maxTokens: 60000
  },
  Mistral: {
    model: 'mistral-large',
    apiKey: process.env.MISTRAL_API_KEY,
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    provider: 'Mistral AI',
    maxTokens: 80000
  }
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0',
    uptime: Math.floor((Date.now() - analytics.uptime) / 1000),
    totalRequests: analytics.totalRequests,
    aisAvailable: Object.keys(AI_MODELS).filter(ai => AI_MODELS[ai].apiKey),
    analytics: {
      requestsByAI: analytics.requestsByAI,
      errorCount: analytics.errorCount,
      averageResponseTime: analytics.averageResponseTime.toFixed(2) + 'ms'
    }
  });
});

// Models List
app.get('/api/models', (req, res) => {
  const models = Object.entries(AI_MODELS).map(([name, config]) => ({
    name: name,
    provider: config.provider,
    model: config.model,
    maxTokens: config.maxTokens,
    available: !!config.apiKey
  }));
  res.json({ models });
});

// Main Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
  const { messages, ai } = req.body;
  
  // Validation
  if (!ai || !AI_MODELS[ai]) {
    return res.status(400).json({ error: 'Invalid AI selection', availableAIs: Object.keys(AI_MODELS) });
  }
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages must be an array' });
  }

  const config = AI_MODELS[ai];
  
  if (!config.apiKey) {
    return res.status(503).json({ error: `API key not configured for ${ai}` });
  }

  try {
    analytics.totalRequests++;
    analytics.requestsByAI[ai]++;

    let content = '';

    // Claude (Anthropic)
    if (ai === 'Claude') {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: 2048,
          messages: messages
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Claude API error: ${response.status} - ${error.error?.message || JSON.stringify(error)}`);
      }

      const data = await response.json();
      content = data.content[0].text;
    }

    // ChatGPT (OpenAI)
    else if (ai === 'ChatGPT') {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: config.model,
          messages: messages,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || JSON.stringify(error)}`);
      }

      const data = await response.json();
      content = data.choices[0].message.content;
    }

    // DeepSeek
    else if (ai === 'DeepSeek') {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: config.model,
          messages: messages
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`DeepSeek API error: ${response.status} - ${error.error?.message || JSON.stringify(error)}`);
      }

      const data = await response.json();
      content = data.choices[0].message.content;
    }

    // Mistral
    else if (ai === 'Mistral') {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: config.model,
          messages: messages
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Mistral API error: ${response.status} - ${error.error?.message || JSON.stringify(error)}`);
      }

      const data = await response.json();
      content = data.choices[0].message.content;
    }

    const responseTime = Date.now() - startTime;
    analytics.averageResponseTime = (analytics.averageResponseTime * 0.8) + (responseTime * 0.2);

    res.json({
      success: true,
      ai: ai,
      content: content,
      tokens: Math.ceil(content.length / 4),
      responseTime: responseTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    analytics.errorCount++;
    console.error(`Error with ${ai}:`, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      ai: ai,
      timestamp: new Date().toISOString()
    });
  }
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available: ['/api/health', '/api/models', '/api/chat']
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Multi-AI backend running on port ${PORT}`);
  console.log(`✅ Anthropic API: ${AI_MODELS.Claude.apiKey ? '✓' : '✗'}`);
  console.log(`✅ OpenAI API: ${AI_MODELS.ChatGPT.apiKey ? '✓' : '✗'}`);
  console.log(`✅ DeepSeek API: ${AI_MODELS.DeepSeek.apiKey ? '✓' : '✗'}`);
  console.log(`✅ Mistral API: ${AI_MODELS.Mistral.apiKey ? '✓' : '✗'}`);
  console.log('\nAvailable endpoints:');
  console.log(`  GET  /api/health  - Server status`);
  console.log(`  GET  /api/models  - List available AIs`);
  console.log(`  POST /api/chat    - Send message to AI`);
});

module.exports = app;
