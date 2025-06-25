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

  // Temporarily serve a basic HTML page with React app until Vite issue is resolved
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) return;
    
    res.status(200).send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LOULOU - Loup-Garou Game Master</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
      color: white;
      min-height: 100vh;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .header p { opacity: 0.8; font-size: 1.1rem; }
    .card { 
      background: rgba(255, 255, 255, 0.1); 
      border-radius: 12px; 
      padding: 24px; 
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .button:hover { background: #2563eb; }
    .button:disabled { background: #6b7280; cursor: not-allowed; }
    .input {
      width: 100%;
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 16px;
      margin-bottom: 16px;
    }
    .input::placeholder { color: rgba(255, 255, 255, 0.6); }
    .game-info { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 20px; 
      margin-bottom: 20px; 
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      background: #10b981;
    }
    .player-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .player-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .hidden { display: none; }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect } = React;
    
    function App() {
      const [currentGame, setCurrentGame] = useState(null);
      const [players, setPlayers] = useState([]);
      const [newPlayerName, setNewPlayerName] = useState('');
      const [loading, setLoading] = useState(false);
      
      const createGame = async () => {
        setLoading(true);
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
          const game = await response.json();
          setCurrentGame(game);
          loadPlayers(game.id);
        } catch (error) {
          alert('Erreur lors de la création de la partie: ' + error.message);
        }
        setLoading(false);
      };
      
      const loadPlayers = async (gameId) => {
        try {
          const response = await fetch(\`/api/games/\${gameId}/players\`);
          const playersData = await response.json();
          setPlayers(playersData);
        } catch (error) {
          console.error('Erreur lors du chargement des joueurs:', error);
        }
      };
      
      const addPlayer = async () => {
        if (!newPlayerName.trim() || !currentGame) return;
        
        setLoading(true);
        try {
          const response = await fetch(\`/api/games/\${currentGame.id}/players\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: newPlayerName.trim(),
              position: players.length + 1,
              status: 'alive',
              isInLove: false
            })
          });
          const player = await response.json();
          setPlayers([...players, player]);
          setNewPlayerName('');
        } catch (error) {
          alert('Erreur lors de l\\'ajout du joueur: ' + error.message);
        }
        setLoading(false);
      };
      
      if (!currentGame) {
        return (
          <div className="container">
            <div className="header">
              <h1>🐺 LOULOU</h1>
              <p>Assistant de Maître du Jeu pour Loup-Garou</p>
            </div>
            <div className="card">
              <h2 style={{marginBottom: '16px'}}>Créer une Nouvelle Partie</h2>
              <p style={{marginBottom: '20px', opacity: 0.8}}>
                Commencez une nouvelle partie de Loup-Garou avec révélation progressive des rôles.
              </p>
              <button 
                className="button" 
                onClick={createGame} 
                disabled={loading}
              >
                {loading ? 'Création...' : 'Créer une Partie'}
              </button>
            </div>
          </div>
        );
      }
      
      return (
        <div className="container">
          <div className="header">
            <h1>🐺 LOULOU</h1>
            <p>Partie #{currentGame.id}</p>
          </div>
          
          <div className="game-info">
            <div className="card">
              <h3>Statut de la Partie</h3>
              <span className="status-badge">Préparation</span>
            </div>
            <div className="card">
              <h3>Joueurs</h3>
              <p>{players.length} joueur(s) inscrit(s)</p>
            </div>
          </div>
          
          <div className="card">
            <h3 style={{marginBottom: '16px'}}>Ajouter un Joueur</h3>
            <input
              className="input"
              type="text"
              placeholder="Nom du joueur"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button 
              className="button" 
              onClick={addPlayer} 
              disabled={loading || !newPlayerName.trim()}
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
          
          {players.length > 0 && (
            <div className="card">
              <h3 style={{marginBottom: '16px'}}>Liste des Joueurs</h3>
              <div className="player-list">
                {players.map((player) => (
                  <div key={player.id} className="player-card">
                    <strong>{player.name}</strong>
                    <div style={{fontSize: '14px', opacity: 0.8}}>
                      Position {player.position}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {players.length >= 4 && (
            <div className="card">
              <h3 style={{marginBottom: '16px'}}>Prêt à Commencer</h3>
              <p style={{marginBottom: '16px', opacity: 0.8}}>
                Vous avez suffisamment de joueurs pour commencer la partie.
              </p>
              <button className="button">
                Configurer les Rôles
              </button>
            </div>
          )}
        </div>
      );
    }
    
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
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
