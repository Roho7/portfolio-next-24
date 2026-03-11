import { GoogleGenAI } from "@google/genai";
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.migration" });

// ─── Clients ──────────────────────────────────────────────────────────────────

export const gemini = new GoogleGenAI({
  apiKey: 'AIzaSyDpMd0DQaf9McY_xyVG4YGWHORdfUSCWXI'
});

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

const DRY_RUN = process.env.DRY_RUN === "true";

// ─── Feature Definitions ──────────────────────────────────────────────────────

interface FeatureSpec {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  tags: string[];
  context: string;
}

const PERISKOPE_AI_FEATURES: FeatureSpec[] = [
  {
    id: "ai-agent",
    title: "Building a WhatsApp AI Agent with Multi-Turn Tool Calling",
    slug: "periskope-whatsapp-ai-agent",
    subtitle: "AI Infrastructure · Periskope",
    tags: ["AI", "WhatsApp", "Gemini", "OpenAI", "BullMQ", "Redis", "Node.js", "TypeScript"],
    context: `
FEATURE: Autonomous WhatsApp AI Agent

WHAT IT DOES:
An AI agent that automatically reads incoming WhatsApp customer messages and responds
on behalf of businesses. It uses multi-turn tool calling — meaning it can take real
actions (create support tickets, fetch knowledge base context, send file attachments,
add internal notes) before composing a final reply.

TECHNICAL ARCHITECTURE:
- Router (router.ts): Message gatekeeper. Validates incoming messages, checks if the
  AI agent is enabled for that org, respects shift hours, and uses a lightweight
  Mistral 3B model (via OpenRouter) to classify whether the message even needs a
  response. Valid messages are queued into BullMQ with a 3-second delay (debounce).

- Processor (processor.ts): Main AI orchestration loop. Feeds conversation history
  + RAG context into the LLM, then executes any tool calls the model requests.
  Loops up to 10 times (tool iterations) until the model produces a final text reply
  or calls no_response_needed.

- Memory (memory.ts): Redis-based session management. Maintains three keys per
  conversation:
    1. ai-session:{org}:{chat}:{phone} — Gemini Content objects (conversation history)
    2. ai-session-meta:{org}:{chat}:{phone} — token usage, tool call count, context
    3. ai-periskope:{org}:{chat}:{phone} — raw message store with full metadata
  Session TTL: 5 minutes. Max 50 messages per session. Handles cold cache by merging
  historical messages on first load.

- Tools (tools.ts): 9 built-in tools the agent can call:
    create_ai_ticket, create_private_note, fetch_additional_context,
    send_attachment, get_previous_messages, no_response_needed,
    get_chat_details, get_org_labels, update_chat_labels
  Also supports custom HTTP tools defined by each business.

- Prompts (prompts.ts): Org-level system prompt templates. Includes company overview,
  escalation rules, tone settings, and agent "archetype" personalities.

SCALABILITY:
- 3 parallel AI servers using RabbitMQ consistent hashing (same conversation always
  goes to the same server, preventing race conditions)
- BullMQ workers: 150 concurrent jobs per server = 450 total concurrent agent sessions
- Mid-processing message detection: if new messages arrive while the agent is thinking,
  they are automatically re-queued

MODELS USED:
- OpenAI GPT (primary agent responses)
- Mistral 3B via OpenRouter (cheap activation classification)
- Session TTL: 300 seconds

KEY ENGINEERING CHALLENGES SOLVED:
- Race conditions: Router writes only to ai-periskope key, Processor writes only to
  ai-session key — strict separation prevents interleaving
- Snooze: If a human team member replies during AI session, the agent pauses
- Cost optimization: Cheap model for routing decisions, powerful model only for actual replies
`,
  },
  {
    id: "rag-knowledge-base",
    title: "RAG Pipeline: How Periskope Builds a Searchable Knowledge Base",
    slug: "periskope-rag-knowledge-base",
    subtitle: "AI Infrastructure · Periskope",
    tags: ["RAG", "Embeddings", "Gemini", "Vector Search", "Knowledge Base", "TypeScript", "PostgreSQL"],
    context: `
FEATURE: Retrieval-Augmented Generation (RAG) Knowledge Base

WHAT IT DOES:
Businesses upload FAQ documents and Q&A pairs. When the AI agent receives a customer
message, it first searches this knowledge base for relevant answers before generating
a response. This grounds the AI in verified business-specific information rather than
hallucinating.

EMBEDDING PIPELINE:
- Model: gemini-embedding-001 (768 dimensions)
- Task type: QUESTION_ANSWERING
- Input processing:
    1. Tokenization + Porter Stemmer lemmatization
    2. Questions, answers, and combined text embedded separately
    3. Results stored in tbl_ai_contexts with pgvector column

RAG RETRIEVAL (fetchRelevantContext):
1. Query expansion: Input query is expanded with synonyms
   (e.g., "price" → ["price", "cost", "fee", "rate", "charge"])
2. Embedding generation: Query text → 768-dim vector
3. Cosine similarity search against stored vectors
4. Confidence filtering: Results below 0.5 similarity score discarded
5. Keyword fallback: If embedding generation fails, falls back to full-text search
6. Returns: top 3–20 results with answer text, similarity score, context ID, attachments

KNOWLEDGE BASE TYPES:
- faq: Manually created Q&A pairs by business staff
- self-learned: Auto-generated from successful agent conversations (requires approval)
- documents: PDFs or text files with chunked content

SESSION CONTEXT ACCUMULATION:
- Context retrieved per message is stored in session metadata as relevant_context map
- Capped at 20 entries max
- Aggressively trimmed when session metadata exceeds 40MB
- The agent can call fetch_additional_context tool mid-conversation for more context

DOCUMENT PROCESSING:
- Supported: PDF (via pdf-parse), plain text, Word docs
- PDF processing: extracts text, removes page headers/footers and "Page X of Y" noise,
  chunks into sections, generates embeddings per chunk
- Stores document metadata: bucket, path, size, source reference
`,
  },
  {
    id: "self-learning-training",
    title: "How Periskope's AI Trains Itself from Resolved Conversations",
    slug: "periskope-ai-self-learning-training",
    subtitle: "AI Infrastructure · Periskope",
    tags: ["Self-Learning", "AI Training", "Gemini", "Mistral", "BullMQ", "RabbitMQ", "TypeScript"],
    context: `
FEATURE: Automated AI Training Pipeline (Self-Learning)

WHAT IT DOES:
Every 24 hours, the system reviews conversations where the AI agent successfully helped
customers. It extracts generalizable knowledge from these conversations and creates new
knowledge base entries — effectively letting the AI learn from experience without manual
data labeling.

PIPELINE STAGES:
1. Cron Trigger
   - Staggered 24-hour slots (different orgs run at different times to distribute load)
   - Emits org + time range into RabbitMQ training queue

2. Conversation Fetching
   - Queries last 24h chats where the AI agent sent at least one internal reply
   - Batch size: 300 candidates

3. Pre-Screening with Ministral 3B
   - Processes candidates in batches of 10 using OpenRouter (cheap model)
   - Classifies each conversation: is it suitable training material? (yes/no + reason)
   - Filters to max 50 quality candidates per org

4. Grouping by Topic
   - Applies union-find algorithm to group conversations that share ≥2 tags
   - Tag overlap signals topical similarity (e.g., "billing" + "refund" conversations grouped together)

5. Training with Gemini Flash
   - Processes top 3 conversations per group
   - Uses a tool-calling agent with 3 available actions:
       create_context: Add a new knowledge base entry
       update_context: Improve an existing entry with new info
       skip_training: Skip if conversation doesn't yield generalizable knowledge
   - Output format: Question (3 comma-separated phrasings), Answer with <INSTRUCTION> tags
     for conditional responses

6. Storage
   - New entries stored in tbl_ai_contexts with:
       - Type: self-learned
       - Status: pending_approval (human must review before it goes live)
       - Embedding vector (auto-generated)
       - Metadata: source chat_id, org_phone

MODELS:
- Pre-screening: Ministral 3B (fast, cheap classification)
- Training agent: Gemini 3 Flash (reasoning, tool calling)

WHY THIS MATTERS:
Traditional chatbots require constant manual FAQ updates. This pipeline closes the loop —
edge cases the AI handles well automatically become part of its future knowledge base,
with a human-in-the-loop approval step to prevent low-quality entries from going live.
`,
  },
  {
    id: "chat-assistant",
    title: "Streaming AI Chat Assistant with Voice Input and Tool Execution",
    slug: "periskope-chat-assistant",
    subtitle: "Product Feature · Periskope",
    tags: ["Streaming", "SSE", "Gemini", "Voice Input", "React", "TypeScript", "BullMQ"],
    context: `
FEATURE: Real-Time Streaming Chat Assistant (Internal Tool for Teams)

WHAT IT DOES:
A Copilot-style chat interface embedded in the Periskope dashboard. Support agents can
ask questions about any customer conversation, get AI-generated draft replies, or run
commands like "summarize this chat" — all with streaming responses and voice input support.

TECHNICAL ARCHITECTURE:
Backend (chatAssistant handler):
- Streaming via Server-Sent Events (SSE) — responses appear word-by-word in real time
- Session TTL: 30 minutes (longer than the autonomous agent's 5 minutes)
- Max 50 messages per session
- Tool calling loop: up to 10 iterations per user message
- Audio input: accepts base64-encoded audio, transcribes before processing
- Available tools: create_note, create_ticket, fetch_context, send_attachment,
  get_previous_messages, custom HTTP tools

Frontend hooks (desktop app):
- useStreamChat.ts: Consumes SSE stream, handles partial tokens, manages loading state
- useVoiceInput.ts: Microphone access, recording, base64 encoding, transcription trigger
- Message history display with tool call visibility (shows which tools were invoked)

AI PLAYGROUND:
A dedicated testing interface within the dashboard where developers and admins can:
- Send test messages to the agent
- Modify the system prompt on-the-fly
- Run dry-run conversations without affecting real customers
- Inspect tool calls, token counts, and session metadata

MODELS: Google Gemini (via Vertex AI)

WHAT MAKES IT DIFFERENT FROM A STANDARD CHATBOT:
- The assistant has full context of the currently open WhatsApp conversation
- It can take real actions (create a ticket, add a note) not just generate text
- Voice input lets mobile/tablet-heavy support teams interact hands-free
- Streaming makes long AI responses feel instant rather than blocked
`,
  },
  {
    id: "message-summarization",
    title: "AI-Powered Chat Summarization and Response Generation",
    slug: "periskope-ai-summarization",
    subtitle: "Product Feature · Periskope",
    tags: ["Summarization", "Gemini", "AI", "WhatsApp", "TypeScript"],
    context: `
FEATURE: Message Summarization & AI Response Generation

WHAT IT DOES:
Three utility AI endpoints accessible from the conversation view:
1. Summarize Chat — condenses a conversation window into a short briefing
2. Generate Response — drafts a full reply to the customer (with optional custom prompt)
3. Reply with AI — generates a contextual reply to a specific quoted message

USE CASES:
- Agent handoff: "Summarize the last 30 minutes" gives a new agent instant context
  without reading the full thread
- Draft assistance: Click "Generate Response" to get an AI-written draft, then edit
  and send — faster than writing from scratch
- Reply to complex questions: Highlight a specific customer message → "Reply with AI"
  for a focused, contextual answer

TECHNICAL DETAILS:
- Model: Gemini 2.5 Flash Lite (optimized for speed + cost on short-context tasks)
- Summarize endpoint: Takes duration_minutes parameter, pulls messages from that window,
  summarizes key points, issues, and resolution status
- Generate endpoint: Uses full chat context + optional custom_prompt override
  (e.g., "respond formally in Spanish")
- Reply endpoint: Takes the specific message ID as anchor context

API ENDPOINTS:
  POST /private/ai/summarize-chat    — { chat_id, duration_minutes }
  POST /private/ai/generate-response — { chat_id, custom_prompt? }
  POST /private/ai/reply-with-ai     — { chat_id, message_id }

DESIGN PHILOSOPHY:
These features are intentionally "human in the loop" — the AI never sends automatically.
The output always lands in the compose box for the agent to review, edit, and send.
This keeps AI as an accelerator, not a replacement.
`,
  },
  {
    id: "mcp-integration",
    title: "Building an MCP Server: How Periskope Connects to External AI Agents",
    slug: "periskope-mcp-server",
    subtitle: "AI Infrastructure · Periskope",
    tags: ["MCP", "Claude", "Model Context Protocol", "API", "TypeScript", "AI Integration"],
    context: `
FEATURE: Model Context Protocol (MCP) Integration

WHAT IT DOES:
Periskope exposes all its core functionality as an MCP (Model Context Protocol) server.
This allows external AI assistants — Claude Desktop, Cursor, custom GPT plugins — to
interact with WhatsApp conversations, contacts, tickets, and more through natural language.

WHY MCP:
MCP is Anthropic's open standard for connecting AI models to external tools and data
sources. By implementing it, Periskope becomes natively usable from any MCP-compatible
AI client without requiring custom integrations per platform.

82 AVAILABLE TOOLS (categories):

Chat Management:
  list_chats, get_chat, create_chat, update_chat, search_chats_by_name,
  update_chat_labels, update_chat_settings

Message Management:
  send_message, edit_message, delete_message, list_messages, react_to_message,
  forward_message, search_messages

Contact Management:
  list_contacts, get_contact, update_contact, search_contacts, update_contact_labels

Group Management:
  add_participant, remove_participant, promote_admin, demote_admin

Ticket Management:
  get_all_tickets, get_ticket, update_ticket_status

USAGE:
Add to claude_desktop_config.json:
{
  "mcpServers": {
    "periskope": {
      "command": "npx",
      "args": ["-y", "@periskope/mcp"],
      "env": { "PERISKOPE_API_KEY": "..." }
    }
  }
}

Then in Claude Desktop: "Show me all unresolved chats from today" or
"Send a follow-up message to the customer who asked about pricing"

WHAT THIS UNLOCKS:
- Power users can manage hundreds of WhatsApp conversations via AI assistant
- Developers can script complex workflows in natural language
- Periskope becomes an AI-native platform, not just an AI-powered one
`,
  },
];

// ─── Portable Text Helpers ────────────────────────────────────────────────────

function block(text: string, style = "normal"): object {
  return {
    _type: "block",
    _key: randomKey(),
    style,
    children: [{ _type: "span", _key: randomKey(), text, marks: [] }],
    markDefs: [],
  };
}

function heading(text: string, level: "h2" | "h3" = "h2"): object {
  return block(text, level);
}

function callout(content: string, type: "info" | "success" | "quote" = "info"): object {
  return { _type: "callout", _key: randomKey(), type, content };
}

function codeBlock(code: string, language = "typescript", filename?: string): object {
  return { _type: "codeBlock", _key: randomKey(), language, code, filename };
}

function statsGrid(items: { label: string; value: string }[]): object {
  return {
    _type: "stats",
    _key: randomKey(),
    items: items.map((item) => ({ ...item, _key: randomKey() })),
  };
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 12);
}

// ─── Claude Post Generator ────────────────────────────────────────────────────

interface GeneratedPost {
  excerpt: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    codeSnippet?: { language: string; code: string; filename?: string };
    callout?: { type: "info" | "success" | "quote"; content: string };
    stats?: { label: string; value: string }[];
  }>;
}

async function generatePostContent(feature: FeatureSpec): Promise<GeneratedPost> {
  console.log(`\n  Calling Gemini for: ${feature.title}`);

  const prompt = `You are writing a detailed technical case study for a developer portfolio website.
The author (a software engineer) built the following AI feature as part of building Periskope,
a WhatsApp business communication platform.

Write a moderately long, technically rich post (6–8 sections) that explains:
- What problem this feature solves and why it matters
- How it works technically (architecture, data flow, key decisions)
- Interesting engineering challenges and how they were solved
- Performance, scale, or reliability considerations
- What you'd do differently or improve next

The tone should be personal, first-person, thoughtful — like an engineering blog post.
Include real technical details from the context. Don't be vague or generic.

FEATURE CONTEXT:
${feature.context}

Respond with ONLY a JSON object matching this exact structure (no markdown fences):
{
  "excerpt": "2–3 sentence summary for the project card (max 200 chars)",
  "sections": [
    {
      "heading": "Section heading (concise, no numbering)",
      "paragraphs": ["paragraph 1", "paragraph 2"],
      "codeSnippet": { "language": "typescript", "code": "...", "filename": "optional" },
      "callout": { "type": "info|success|quote", "content": "highlight text" },
      "stats": [{ "label": "Metric name", "value": "150 concurrent jobs" }]
    }
  ]
}

Rules:
- Every section must have heading + at least 1 paragraph
- codeSnippet, callout, stats are optional per section — use them where they add value
- Include 1–2 code snippets total showing real-looking architecture/pseudocode
- Include 1 stats section showing scale or performance numbers
- Include 1–2 callout boxes for key insights
- Aim for 6–8 sections total`;

  const response = await gemini.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { maxOutputTokens: 8192 },
  });

  const raw = response.text?.trim() ?? "";

  // Strip markdown code fences if model wraps in them despite instructions
  const jsonStr = raw.startsWith("```")
    ? raw.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "")
    : raw;

  return JSON.parse(jsonStr) as GeneratedPost;
}

// ─── Convert GeneratedPost → Sanity Portable Text ────────────────────────────

function buildContent(post: GeneratedPost): object[] {
  const blocks: object[] = [];

  for (const section of post.sections) {
    blocks.push(heading(section.heading, "h2"));

    for (const para of section.paragraphs) {
      blocks.push(block(para));
    }

    if (section.codeSnippet) {
      blocks.push(
        codeBlock(
          section.codeSnippet.code,
          section.codeSnippet.language,
          section.codeSnippet.filename
        )
      );
    }

    if (section.callout) {
      blocks.push(callout(section.callout.content, section.callout.type));
    }

    if (section.stats && section.stats.length > 0) {
      blocks.push(statsGrid(section.stats));
    }
  }

  return blocks;
}

// ─── Sanity Document Builder ──────────────────────────────────────────────────

async function getOrCreateCategory(title: string): Promise<string> {
  const existing = await sanity.fetch<{ _id: string } | null>(
    `*[_type == "category" && title == $title][0]{ _id }`,
    { title }
  );
  if (existing) return existing._id;

  const created = await sanity.create({
    _type: "category",
    title,
    slug: { _type: "slug", current: title.toLowerCase().replace(/\s+/g, "-") },
    description: `AI engineering work built for Periskope`,
  });

  console.log(`  Created category: ${title} (${created._id})`);
  return created._id;
}

async function postExists(slug: string): Promise<boolean> {
  const result = await sanity.fetch<{ _id: string } | null>(
    `*[_type == "project" && slug.current == $slug][0]{ _id }`,
    { slug }
  );
  return !!result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60));
  console.log("Periskope AI Posts Generator");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no writes)" : "LIVE"}`);
  console.log("=".repeat(60));

  let categoryId: string | null = null;
  if (!DRY_RUN) {
    categoryId = await getOrCreateCategory("AI Engineering");
    console.log(`\nCategory ID: ${categoryId}`);
  }

  for (const feature of PERISKOPE_AI_FEATURES) {
    console.log(`\n${"─".repeat(50)}`);
    console.log(`Processing: ${feature.title}`);

    if (!DRY_RUN) {
      const exists = await postExists(feature.slug);
      if (exists) {
        console.log(`  Skipping — already exists in Sanity`);
        continue;
      }
    }

    let post: GeneratedPost;
    try {
      post = await generatePostContent(feature);
      console.log(`  Generated ${post.sections.length} sections`);
    } catch (err) {
      console.error(`  Failed to generate content:`, err);
      continue;
    }

    const content = buildContent(post);
    console.log(`  Built ${content.length} content blocks`);

    const document = {
      _type: "project",
      title: feature.title,
      slug: { _type: "slug", current: feature.slug },
      subtitle: feature.subtitle,
      excerpt: post.excerpt,
      tags: feature.tags,
      year: "2024",
      publishedAt: new Date().toISOString(),
      featured: false,
      hidden: false,
      order: 100,
      projectInfo: {
        platform: "Web · API · AI Infrastructure",
        role: ["AI Engineer", "Full-Stack Engineer"],
        client: "Periskope",
      },
      links: {
        live: "https://periskope.app",
      },
      content,
      ...(categoryId
        ? { category: { _type: "reference", _ref: categoryId } }
        : {}),
    };

    if (DRY_RUN) {
      console.log(`  [DRY RUN] Would create document with ${content.length} blocks`);
      console.log(`  Excerpt: ${post.excerpt}`);
    } else {
      try {
        const created = await sanity.create(document);
        console.log(`  Created: ${created._id} → /projects/${feature.slug}`);
      } catch (err) {
        console.error(`  Failed to create Sanity document:`, err);
      }
    }

    // Small delay between API calls to avoid rate limits
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("Done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
