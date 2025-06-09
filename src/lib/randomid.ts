const AUTO_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const AUTO_ID_LENGTH = 12;

export const generateRandomId = (): string => {
    let id = '';
    for (let i = 0; i < AUTO_ID_LENGTH; i++) {
        id += AUTO_ID_CHARS.charAt(Math.floor(Math.random() * AUTO_ID_CHARS.length));
    }
    return id;
};