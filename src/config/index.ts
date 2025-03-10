import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(process.cwd(), '.env') })
const config = {
  port: 5000,
  database_url: process.env.DATABASE_URL || '',
  bycrypt_sault_round: 12,
  env: process.env.NODE_ENV,
  jwt_secret: 'secret',
  jwt_expires_in: '1d',
  jwt_refresh_secret: 'very very secret',
  jwt_refresh_expires_in: '365d',
}
export default config
