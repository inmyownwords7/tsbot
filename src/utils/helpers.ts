import path from 'path'

function isCommand(command: string | any[], text: string) {
    if (text.substring(0, command.length) === command) {
        const args = text.substring(command.length + 1, text.length).split(' ')
        return args || true
    }
    return false
}

function modCommand(STRINGSTART:string, text:string, messageMetaData: { isMod: any  }) {
    if (!messageMetaData.isMod) return false
    return isCommand(STRINGSTART, text)
}

function deputyCommand(STRINGSTART: any, text: any, messageMetaData: { isDeputy: any }) {
    if (!messageMetaData.isDeputy) return false
    return isCommand(STRINGSTART, text)
}

function absolutePath(from: string, to: string): string {
    return path.resolve(from, to)
}

function isTextStarting(pattern: string, text: string) {
    const startString = text.startsWith(pattern)
    return startString
}

export {absolutePath, isTextStarting, modCommand, deputyCommand}