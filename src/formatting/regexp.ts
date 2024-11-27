const BLOCKED_LANGUAGES = [
    '\\p{Cyrillic}',
    '\\p{Arabic}',
    '\\p{Hiragana}',
    '\\p{Greek}',
    '\\p{Hebrew}',
    '\\p{Hangul}',
    '\\p{Han}'
]
const regexLang = BLOCKED_LANGUAGES.map(word => word.toLowerCase()).join('|')
export {regexLang}