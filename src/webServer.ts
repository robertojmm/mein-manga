import * as express from 'express';
import { Application } from 'express';
import settings from './common/settings';
import { env } from './env';
import * as path from 'path';

class WebServer {
  private app: Application;
  private port: number;
  private clientFolder: string;

  constructor() {
    this.app = express();
    this.port = env.WEB_APP_PORT;

    this.clientFolder = settings.get('WEB_FOLDER');

    this.app.use(express.static(this.clientFolder));

    this.app.get('/*', (req, res) => {
      res.sendFile(path.join(this.clientFolder, 'index.html'), function(err) {
        if (err) {
          res.status(500).send(err);
        }
      });
    });
  }

  listen(): void {
    this.app.listen(this.port, () =>
      console.log(`Web server running on port ${this.port}`),
    );
  }
}

export default WebServer;
