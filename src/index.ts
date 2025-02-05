// Import required packages
import * as restify from 'restify';
import * as path from 'path';

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import {
  CloudAdapter,
  ConfigurationServiceClientCredentialFactory,
  ConfigurationBotFrameworkAuthentication,
  ConfigurationBotFrameworkAuthenticationOptions,
  TurnContext
} from 'botbuilder';

// This bot's main dialog.
import { TeamsBot } from './teamsBot';
import config from './config';
import { UserService } from './services/userService';
import { FetchUserMiddleware } from './services/fetchUserMiddleware';
import { MyStorage } from './services/storage';
import { BotBuilderCloudAdapter } from '@microsoft/teamsfx';



// Initialize custom storage
const myStorage = new MyStorage()

// Initialize ConversationBot with notification enabled and customized storage
const conversationBot = new BotBuilderCloudAdapter.ConversationBot({
  adapterConfig: {
    appId: config.botId,
    appPassword: config.botPassword,
  },
  notification: {
    enabled: true 
      }
      
});




// Create adapter.
const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppId: config.botId,
  MicrosoftAppPassword: config.botPassword,
  MicrosoftAppType: "MultiTenant",
});



const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(
  {},
  credentialsFactory,
);

const adapter = new CloudAdapter(botFrameworkAuthentication);

// Add EnsureUserSetupMiddleware to the adapter's middleware pipeline
// Create UserService instance (using the singleton pattern)
const userService = UserService.getInstance();

// Add FetchUserMiddleware and pass the userService instance
adapter.use(new FetchUserMiddleware(userService));

// Catch-all for errors.
const onTurnErrorHandler = async (context: TurnContext, error: Error) => {
  // Retrieve user information
  const userId = context.activity.from.id;
  const aadObjectId = context.activity.from.aadObjectId;
  const userName = context.activity.from.name;

  // Log user information
  console.log(`User ID: ${userId}`);
  console.log(`User AAD Object ID: ${aadObjectId}`);
  console.log(`User Display Name: ${userName}`);

  // This check writes out errors to console log .vs. app insights.
  // NOTE: In production environment, you should consider logging this to Azure
  //       application insights.
  console.error(`\n [onTurnError] unhandled error: ${error}`);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    'OnTurnError Trace',
    `${error}`,
    'https://www.botframework.com/schemas/error',
    'TurnError',
  );

  // Send a message to the user
  await context.sendActivity(
    `The bot encountered unhandled error:\n ${error.message}`,
  );
  await context.sendActivity(
    'To continue to run this bot, please fix the bot source code.',
  );
};

// Set the onTurnError for the singleton CloudAdapter
adapter.onTurnError = onTurnErrorHandler;

// Create the bot that will handle incoming messages.

const conversationReferences = {}

const teamsBot = new TeamsBot(conversationReferences);

// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nBot Started, ${server.name} listening to ${server.url}`);
});

// Listen for incoming requests.
server.post('/api/messages', async (req, res) => {
  await adapter
    .process(req, res, async context => {
      await teamsBot.run(context);
    })
    .catch(err => {
      // Error message including "412" means it is waiting for user's consent, which is a normal process of SSO, sholdn't throw this error.
      if (!err.message.includes('412')) {
        throw err;
      }
    });
});

server.get(
  '/auth-:name(start|end).html',
  restify.plugins.serveStatic({
    directory: path.join(__dirname, '../public'),
  }),
);

// Endpoint to trigger proactive messages
server.get('/api/notify', async (req, res) => {
  for (const conversationReference of Object.values(conversationReferences)) {
      await adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference, async context => {
          await context.sendActivity('proactive hello');
      });
  }

  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.write('<html><body><h1>Proactive messages have been sent.</h1></body></html>');
  res.end();
});