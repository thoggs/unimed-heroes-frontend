import * as express from 'express';
import * as serveStatic from 'serve-static';
import * as path from 'path';

const app = express();

app.use(serveStatic(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
