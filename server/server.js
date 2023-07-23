import { Configuration, OpenAIApi } from "openai-edge";
import express from "express";
import cors from "cors";
import { OpenAIStream, StreamingTextResponse } from "ai";

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

const configuration = new Configuration({
  apiKey: process.env["OPENAI_KEY"],
});
const openai = new OpenAIApi(configuration);

const basePrompt =
  'I am a helpful AI assistant. If you give me a list of items on your TO-DO list, I will generate another TO-DO that aligns with your goals or corresponds to your demographic. I will try not to generate a TO-DO that you may not neccessarily need to do.\n\nTO-DOs: Do homework, Go to gym, Finish math assignment\nA: Do additional studying\n\nTO-DOs: Watch "The Incredible Hulk", Watch "Iron Man 2", Watch "Avengers: Age of Ultron"\nA: Watch "Doctor Strange"\n\nTO-DOs: Drink protein, Go for my daily jog, Eat an apple\nA: Drink fruit smoothie\n\nTO-DOs: ';

function generatePrompt(todos) {
  return basePrompt + todos.join(", ") + "\nA: ";
}

app.post(["/"], async (req, res) => {
  const body = req.body;
  if (!body.todos || typeof body.todos !== "object" || body.todos.length === 0) {
    res.statusCode = 400;
    res.send({ error: "Malformed todos." });
    return;
  }

  const todos = body.todos;
  let completion = null;
  try {
    completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(todos),
      temperature: 0,
      max_tokens: 25,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\n", "."],
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
  res.send("<h1>Test auto-tagging again x6</h1>");
});

app.listen(port, () => console.log(`angular-todolist-server app listening on port ${port}!`));
