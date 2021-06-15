module.exports.run = async (client, message, args) => {
    const res = await client.manager.search(
        args.join(' '),
        message.author
    );
    
      // Create a new player. This will return the player if it already exists.
    const player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
    });
  
      // Connect to the voice channel.
    player.connect();

    // Adds the first track to the queue.
    player.queue.add(res.tracks[0]);
    message.channel.send(`Enqueuing track ${res.tracks[0].title}.`);

    // Plays the player (plays the first track in the queue).
    // The if statement is needed else it will play the current track again
    if (!player.playing && !player.paused && !player.queue.size) player.play();

    // For playlists you'll have to use slightly different if statement
    if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
    

};

module.exports.help = {
    name: "play",
    aliases : ["play"],
    category : 'radio',
    description: "Allume la radio",
    cooldown: 10,
    usage: "",
    args: false,
    permission: "staff",
};