import { OPENAI_KEY } from "./secrets.js";
import { Configuration, OpenAIApi } from "openai";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
const port = process.env["PORT"] || 3001;

const allowedOrigins = ["http://localhost:4200"];
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
  apiKey: OPENAI_KEY,
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
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\n"],
    });
  } catch (e) {
    res.statusCode = 500;
    res.send({ error: "Internal server error." });
    return;
  }

  res.statusCode = 200;
  res.send({ completion: completion.data.choices[0].text });
});

app.listen(port, () => console.log(`angular-todolist-server app listening on port ${port}!`));
