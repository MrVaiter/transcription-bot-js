const { joinVoiceChannel } = require("@discordjs/voice");

// Join voice channel
const joinChannel = (message) => {
  if (!message.member.voice.channel) {
    message.reply("Please, connect to voice channel");
    return;
  }

  return joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
    selfDeaf: false,
  });
};

export default joinChannel;
