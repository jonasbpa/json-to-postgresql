require('dotenv').config({ path: '../.env' });

export default {
    port: +(process.env.PORT || 80),
    connection_string: process.env.CONNECTION_STRING
} as any;
