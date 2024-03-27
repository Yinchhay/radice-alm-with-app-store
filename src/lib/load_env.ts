// not sure why but at some point, dotenv couldn't load in the drizzle folder, import this will fix the issue
import dotenv from 'dotenv';

dotenv.config({ path: '.env'})