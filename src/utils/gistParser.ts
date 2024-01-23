import * as https from 'https';

type GistResponse = {
    files: {
        [filename: string]: {
            content: string;
        };
    };
};

export async function fetchGistContent(gistId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(`https://api.github.com/gists/${gistId}`, {
            headers: {
                'User-Agent': 'Node.js'
            }
        }, (response) => {
            let data = '';

            response.on('data', (chunk: Buffer) => {
                data += chunk.toString();
            });

            response.on('end', () => {
                try {
                    const gist: GistResponse = JSON.parse(data);
                    const filename = Object.keys(gist.files)[0];
                    const fileContent = gist.files[filename].content;
                    resolve(fileContent);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}