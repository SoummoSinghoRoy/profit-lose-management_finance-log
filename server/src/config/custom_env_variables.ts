import dotenv from 'dotenv';
dotenv.config();

interface EnvVariables {
  db_uri: string;
  db_admin: string;
  db_password: number | string;
  secret_key: string;
}

const env_variables: EnvVariables = {
  db_uri: process.env.DB_URI || '',
  db_admin: process.env.DB_ADMIN || '',
  db_password: process.env.DB_PASSWORD || '',
  secret_key: process.env.SECRET_KEY || '' 
}

export default env_variables;