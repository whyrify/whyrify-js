/**
 * Generate method of the Crypto interface is used to generate a v4 UUID
 * using a cryptographically secure random number generator. Available only in secure contexts.
 */
export const id = (): string => {
    return crypto.randomUUID();
};
