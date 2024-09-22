const en = () => ({
    userNotFound: 'User not found',
    loginSuccess: 'Login successful',
})

const fr = () => ({
    userNotFound: "L'utilisateur est introuvable",
    loginSuccess: 'Connexion réussie',
})

const lang = 'en'; // or 'fr'
const MESSAGES = lang === 'en' ? en : fr;