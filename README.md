# Discord Voice-to-Text Bot

A Discord bot that transcribes voice communication into text, enhancing accessibility and inclusivity for users. Ideal for keeping records of conversations or assisting those who prefer or require text communication.

## Installation

Follow these steps to install the Discord voice-to-text bot:

1. Clone the repository:
```
    git clone git@github.com:advantiss/discord-bot.git
```
2. Change to the bot directory:
```
    cd discord-bot
```
3. Install dependencies:
```
    npm install
```
4. Create a `.env` file in the root directory with the following contents:
- `MODEL_PATH={path to your language model}`
- `BOT_TOKEN={bot token from Discord Developers Portal}`
  (Navigate to OAuth2 -> URL Generator -> Scopes, select 'bot' and all necessary permissions)
5. Use the generated URL to add the bot to your Discord channel.
6. Start the bot with:
```
    npm run start
```

## Usage

To use the Discord voice-to-text bot, follow these steps:

1. Open a Discord channel where the bot has been added.
2. Join a voice channel.
3. Write `!join` in the text channel to add the bot to the voice channel.
4. Write `!listen` to start recording and transcribing the voice communication.
5. Write `!reset` to stop recording and remove the bot from the voice channel.
6. Write `!get-reports` to show all available reports.
7. Click to right report name to download it

## P.S.

Use `!hello` to check bot permissions