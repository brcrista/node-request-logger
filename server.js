const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

function readFromStream(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        readableStream.on('data', chunks.push);
        readableStream.on('error', reject);
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks).toString('utf8'));
        });
    });
}

async function logRequest(request) {
    console.log(`${request.method} ${request.url}`);
    for (let i = 0; i < request.rawHeaders.length; i += 2) {
        console.log(`${request.rawHeaders[i]}: ${request.rawHeaders[i + 1]}`);
    }

    const body = await readFromStream(request);
    if (body) {
        console.log(body);
    }

    console.log();
}

const server = http.createServer(async (request, response) => {
    try {
        await logRequest(request);

        if (request.method === 'OPTIONS') {
            // In CORS, the browser will send an OPTIONS request
            // before the actual request.
            response.statusCode = 204;

            const accessControlHeaders = [
                'Access-Control-Allow-Origin',
                'Access-Control-Allow-Methods',
                'Access-Control-Allow-Headers'
            ];

            for (const header of accessControlHeaders) {
                response.setHeader(header, '*');
            }

            response.end();
        } else {
            response.statusCode = 200;
            response.end();
        }
    } catch (e) {
        console.error(e);

        response.statusCode = 500;
        response.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});