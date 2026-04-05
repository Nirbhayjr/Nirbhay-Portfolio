const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ROOT_DIR = __dirname;

const server = http.createServer((req, res) => {
  let filePath = path.join(ROOT_DIR, req.url);
  
  // If no file extension, try index.html
  if (path.extname(filePath) === '') {
    filePath = path.join(filePath, 'index.html');
  }
  
  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // File not found - serve 404.html
      fs.readFile(path.join(ROOT_DIR, '404.html'), 'utf8', (error, content) => {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(content);
      });
    } else if (stats.isDirectory()) {
      // Directory - try to serve index.html
      fs.readFile(path.join(filePath, 'index.html'), 'utf8', (error, content) => {
        if (error) {
          fs.readFile(path.join(ROOT_DIR, '404.html'), 'utf8', (error, content) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content);
          });
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        }
      });
    } else {
      // File exists - serve it
      const contentType = getContentType(filePath);
      fs.readFile(filePath, (error, content) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
    }
  });
});

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.jfif': 'image/jpeg',
    '.ico': 'image/x-icon'
  };
  return contentTypes[ext] || 'application/octet-stream';
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Try visiting http://localhost:${PORT}/satyam to see the 404 page`);
});
