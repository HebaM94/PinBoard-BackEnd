const blacklistedTokens = [];

export function blacklistToken(token) {
  blacklistedTokens.push(token);
}

export function isTokenBlacklisted(token) {
  return blacklistedTokens.includes(token);
}
