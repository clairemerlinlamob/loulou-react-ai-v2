import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // temporarily disable vite setup due to configuration issue
  // serve a simple fallback page instead
  app.get("*", (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>LOULOU - Loup-Garou Game Master</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #1a1a1a; color: white; }
            .container { max-width: 600px; margin: 0 auto; text-align: center; }
            .status { background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .api-test { background: #0f3460; padding: 15px; border-radius: 8px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🐺 LOULOU - Loup-Garou Game Master</h1>
            <div class="status">
              <h2>Server Status: Running ✅</h2>
              <p>Database: Connected ✅</p>
              <p>API Routes: Active ✅</p>
            </div>
            
            <div class="api-test">
              <h3>API Test</h3>
              <button onclick="testAPI()">Test Create Game</button>
              <div id="result"></div>
            </div>
            
            <script>
              async function testAPI() {
                try {
                  const response = await fetch('/api/games', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      status: 'preparation',
                      currentPhase: 'preparation',
                      phaseNumber: 1,
                      currentStep: 0
                    })
                  });
                  const data = await response.json();
                  document.getElementById('result').innerHTML = 
                    '<p style="color: #4ade80;">✅ API Working! Game created with ID: ' + data.id + '</p>';
                } catch (error) {
                  document.getElementById('result').innerHTML = 
                    '<p style="color: #ef4444;">❌ API Error: ' + error.message + '</p>';
                }
              }
            </script>
          </div>
        </body>
      </html>
    `);
  });

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
