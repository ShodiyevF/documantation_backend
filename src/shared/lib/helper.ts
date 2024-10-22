namespace LoggerLib {
    export function getErrorLine(error: any) {
        const stackLines = error.stack.split('\n');
        if (stackLines && stackLines.length >= 2) {
            const line = stackLines[1].trim();
            return line;
        }
    }
}

export default LoggerLib
