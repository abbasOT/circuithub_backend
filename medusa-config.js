const dotenv = require("dotenv");


let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) { }

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "https://admin.circuithub.pk";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "https://circuithub.pk";

// const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";


const BACKEND_URL = "https://admin.circuithub.pk"

const GoogleClientId = process.env.GOOGLE_CLIENT_ID || ""
const GoogleClientSecret = process.env.GOOGLE_CLIENT_SECRET || ""


const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.qbatxyuuboxorqcludga:ecom@octa123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";


const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";




const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
      // base_url: "https://circuithub.pk/uploads",
      backend_url: "http://admin.circuithub.pk"
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      // autoRebuild: true,
      backend_url: "http://admin.circuithub.pk",
      develop: {
        // open: process.env.OPEN_BROWSER !== "false",
        admin_path: "/app",
        open: false,
        host: "circuithub.pk", // Set this to your desired IP address
        port: 7001,  // Set the desired port (if you want to change it from 7001)
      },
    },
  },
  {
    resolve: "medusa-plugin-auth",
    /** @type {import('medusa-plugin-auth').AuthOptions} */
    options: [
      {
        type: "google",
        // strict: "all", // or "none" or "store" or "admin"
        strict: "none",
        identifier: "google",
        clientID: GoogleClientId,
        clientSecret: GoogleClientSecret,
        admin: {
          callbackUrl: `${BACKEND_URL}/admin/auth/google/cb`,
          failureRedirect: `${ADMIN_CORS}/login`,
          successRedirect: `${ADMIN_CORS}/`

        },
        store: {
          callbackUrl: `${BACKEND_URL}/store/auth/google/cb`,
          failureRedirect: `${STORE_CORS}/login`,
          successRedirect: `${STORE_CORS}/`

        }
      }
    ]
  },


  {
    resolve: "medusa-plugin-sendgrid",
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      customer_password_reset_template: process.env.SENDGRID_CUSTOMER_PASSWORD_RESET_ID, // Added for password reset
      order_confirmation_template: process.env.SENDGRID_ORDER_CONFIRMATION_ID,
    },
  },

];

//safasfsagsaggasgsg


const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },

  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: process.env.JWT_SECRET || "supersecret",
  cookie_secret: process.env.COOKIE_SECRET || "supersecret",
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  database_extra: process.env.NODE_ENV !== "development" ?
    {
      ssl: {
        rejectUnauthorized: false,
      },
    } : {},
  // Uncomment the following lines to enable REDIS
  // redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  featureFlags: {
    product_categories: true,
  },
  projectConfig,
  plugins,
  modules,
  // ...

};
