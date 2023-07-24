# AI Todolist

[![GitHub ng.yml Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/HKanwal/ai-todolist/ng.yml)](https://github.com/HKanwal/ai-todolist/actions/workflows/ng.yml)
[![GitHub fly.yml Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/HKanwal/ai-todolist/fly.yml?logo=github&label=Continuous%20Deployment%20(Server))](https://github.com/HKanwal/ai-todolist/actions/workflows/fly.yml)

A todo-list app with an AI twist. Click a button to have the AI recommend new todo items for you. Installable as a PWA on your mobile device.

## Stack
### Frontend

[![Angular Static Badge](https://img.shields.io/badge/Angular-c3002f?logo=Angular)](https://angular.io/)
[![TypeScript Static Badge](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://github.com/search?q=user%3AHKanwal+language%3Atypescript)
[![HTML Static Badge](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=white)](https://github.com/search?q=user%3AHKanwal+language%3Ahtml)
[![CSS Static Badge](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)](https://github.com/search?q=user%3AHKanwal+language%3Acss)
[![GH Pages Static Badge](https://img.shields.io/badge/GitHub%20Pages-181717?logo=github&logoColor=white)](https://github.com/HKanwal/ai-todolist/deployments/activity_log?environment=github-pages)

### Backend

[![Node.js Static Badge](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/en)
[![Express Static Badge](https://img.shields.io/badge/Express-000000?logo=Express&logoColor=white)](https://expressjs.com/)
[![JavaScript Static Badge](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://github.com/search?q=user%3AHKanwal+language%3Ajavascript)
[![Docker Static Badge](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Fly.io Static Badge](https://img.shields.io/badge/Fly.io-8b5cf6)](https://fly.io/)

## Continuous Deployment
### Frontend

Angular app is automatically built and deployed to GitHub Pages [by this workflow](https://github.com/HKanwal/ai-todolist/blob/main/.github/workflows/ng.yml).

### Backend

Node.js server is automatically deployed to Fly.io [by this workflow](https://github.com/HKanwal/ai-todolist/blob/main/.github/workflows/fly.yml) if a change in server files is detected.

## Run Locally

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Remember to run `npm install` to install dependencies.

## AI Model

Powered by OpenAI's gpt-3.5-turbo model.
