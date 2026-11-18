const express = require('express');
const path = require('path');
const app = express();
const port = process.argv[2] ? process.argv[2] : 8085;
const prefix = "/v2/doc";
const distDir = path.join(__dirname, 'docs/.vuepress/dist');
const rootStaticFiles = ['/llms.txt'];

// Do not advertise the framework in an X-Powered-By header.
app.disable('x-powered-by');

// Baseline security headers, set first so they are on every response
// (pages, redirects, 404s and preflight replies alike).
app.use(function (req, res, next) {
    // Keep browsers on HTTPS for a year once they have visited over HTTPS.
    res.header('Strict-Transport-Security', 'max-age=31536000');
    // The docs are never meant to be framed; the two headers cover old and
    // current browsers respectively.
    res.header('X-Frame-Options', 'DENY');
    res.header('Content-Security-Policy', "frame-ancestors 'none'");
    next();
});

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

for (const p of rootStaticFiles) {
    app.get(p, (req, res) => res.sendFile(path.join(distDir, p)));
}

app.use((req, res, next) => {
    if (!req.url.startsWith(prefix)) return res.redirect(302, prefix + req.url);
    next();
});

app.use(express.json());
app.use(prefix, express.static(distDir));

app.use(function (req, res, next) {
    res.status(404).sendFile(path.join(distDir, '404.html'));
});

app.listen(port, () => console.log(`${new Date().toLocaleString()} App listening on port ${port}!`));
