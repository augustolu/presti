const isProd = process.env.NODE_ENV === 'production';
const prefix = isProd ? '/presti' : '';

export { prefix };
