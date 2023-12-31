import { Configuration, OpenAIApi } from "openai-edge";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
const app = express();
app.use(express.json());
const port = process.env["PORT"] || 3001;

const allowedOrigins = ["http://localhost:4200", "https://hkanwal.github.io"];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 30, // 30 reqs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

const configuration = new Configuration({
  apiKey: process.env["OPENAI_KEY"],
});
const openai = new OpenAIApi(configuration);

const baseMessages = [
  {
    role: "system",
    content:
      "Given the user's todo list, you will generate three todos that align with the user's goals or correspond to their demographic. You will try not to generate a todo that the user may not necessarily need to do.",
  },
  {
    role: "user",
    content: 'Watch "Ant-Man"',
  },
  {
    role: "assistant",
    content: 'Watch "Black Panther"\nWatch "Iron Man"\nWatch "Thor"',
  },
  {
    role: "user",
    content: "Drink protein, Do math homework, Make personal website",
  },
  {
    role: "assistant",
    content: "Go to the gym\nStudy math\nAdd mobile compatibility to personal website",
  },
];

function generateMessages(todos) {
  return [...baseMessages, { role: "user", content: todos.join(", ") }];
}

const MSG_CHAR_LIMIT = 120;

app.post(["/"], async (req, res) => {
  const body = req.body;
  if (!body.todos || typeof body.todos !== "object" || body.todos.length === 0) {
    res.statusCode = 400;
    res.send({ error: "Malformed todos." });
    return;
  }

  const todos = body.todos;
  const clippedTodos = todos.map((todo) => todo.substr(0, MSG_CHAR_LIMIT));

  let completion = null;
  try {
    completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: generateMessages(clippedTodos),
      temperature: 0,
      max_tokens: 50,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ error: "Internal server error." });
    return;
  }

  try {
    completion.body.pipeTo(
      new WritableStream({
        start() {
          completion.headers.forEach((v, n) => res.setHeader(n, v));
        },
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        },
      })
    );
  } catch (e) {
    res.statusCode = 500;
    res.send({ error: "Internal server error." });
  }
});

// Endpoint for server testing
app.get("/test/", (req, res) => {
  res.send("<h1>Final CD test</h1>");
});

app.listen(port, () => console.log(`ai-todolist-server app listening on port ${port}!`));
