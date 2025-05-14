import https from 'https';
import { URL } from 'url';

interface GistFile {
    content: string;
    filename: string;
    language: string;
    raw_url: string;
    size: number;
    truncated: boolean;
}

interface GistResponse {
    files: { [key: string]: GistFile };
    html_url: string;
    id: string;
    description: string;
    public: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Extract gist ID from various URL formats
 */
function extractGistId(url: string): string {
    try {
        // Handle raw gist URLs
        if (url.includes('gist.github.com')) {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            return pathParts[pathParts.length - 1];
        }
        
        // Handle direct gist IDs
        if (/^[a-f0-9]{32}$/.test(url)) {
            return url;
        }

        throw new Error('Invalid gist URL or ID format');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to parse gist URL: ${errorMessage}`);
    }
}

/**
 * Rate limiting helper
 */
class RateLimiter {
    private lastRequest: number = 0;
    private minInterval: number;

    constructor(requestsPerMinute: number = 30) {
        this.minInterval = 60000 / requestsPerMinute;
    }

    async wait(): Promise<void> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequest;
        
        if (timeSinceLastRequest < this.minInterval) {
            await new Promise(resolve => 
                setTimeout(resolve, this.minInterval - timeSinceLastRequest)
            );
        }
        
        this.lastRequest = Date.now();
    }
}

const rateLimiter = new RateLimiter();

/**
 * Fetch content from a GitHub gist
 * @param gistUrlOrId The GitHub gist URL or ID
 * @returns The content of the first file in the gist
 * @throws Error if the gist cannot be fetched or parsed
 */
export async function fetchGistContent(gistUrlOrId: string): Promise<string> {
    const gistId = extractGistId(gistUrlOrId);
    
    // Wait for rate limiting
    await rateLimiter.wait();

    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'tree2dir/1.0.0',
                'Accept': 'application/vnd.github.v3+json'
            },
            timeout: 10000 // 10 second timeout
        };

        const req = https.get(
            `https://api.github.com/gists/${gistId}`,
            options,
            (response) => {
                let data = '';
                let error: Error | null = null;

                response.on('data', (chunk: Buffer) => {
                    data += chunk.toString();
                });

                response.on('end', () => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    try {
                        if (response.statusCode === 404) {
                            reject(new Error('Gist not found'));
                            return;
                        }

                        if (response.statusCode === 403) {
                            reject(new Error('Rate limit exceeded. Please try again later.'));
                            return;
                        }

                        if (response.statusCode !== 200) {
                            reject(new Error(`GitHub API error: ${response.statusCode}`));
                            return;
                        }

                        const gist: GistResponse = JSON.parse(data);
                        
                        // Find the first file that looks like an ASCII tree
                        const treeFile = Object.values(gist.files).find(file => 
                            file.content.includes('├──') || 
                            file.content.includes('└──') ||
                            file.content.includes('│')
                        );

                        if (!treeFile) {
                            reject(new Error('No ASCII tree found in the gist'));
                            return;
                        }

                        resolve(treeFile.content);
                    } catch (error: unknown) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                        reject(new Error(`Failed to parse gist response: ${errorMessage}`));
                    }
                });
            }
        );

        req.on('error', (error: Error) => {
            reject(new Error(`Failed to fetch gist: ${error.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timed out'));
        });
    });
}