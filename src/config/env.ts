import dotenv from 'dotenv';

dotenv.config();

function required(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not set.`);
    }
    return value;
}

function optional(key: string, defaultValue: string = ''): string {
    return process.env[key] || defaultValue;
}

export const env = {
    NODE_ENV: optional('NODE_ENV', 'development'),
    PORT: parseInt(optional('PORT', '3000'), 10),
    DATABASE_URL: required('DATABASE_URL'),
    JWT_SECRET: required('JWT_SECRET'),
    JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
    JWT_ACCESS_EXPIRES_IN: optional('JWT_ACCESS_EXPIRES_IN', '15m'),
    JWT_REFRESH_EXPIRES_IN: optional('JWT_REFRESH_EXPIRES_IN', '30d'),
    SMTP_HOST: required('SMTP_HOST'),
    SMTP_PORT: parseInt(optional('SMTP_PORT', '587'), 10),
    SMTP_USER: optional('SMTP_USER', ''),
    SMTP_PASS: optional('SMTP_PASS', ''),
    isProd: () => process.env.NODE_ENV === 'production',
    isDev: () => process.env.NODE_ENV === 'development',
} as const;
