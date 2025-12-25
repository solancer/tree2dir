export function removeComments(input: string): string {
    return input.split('\n')
        .map(line => {
            // Remove comments after '#', but ensure it doesn't match inside filenames
            const commentIndex = line.indexOf(' #');
            return commentIndex !== -1 ? line.substring(0, commentIndex) : line;
        })
        .join('\n');
}
