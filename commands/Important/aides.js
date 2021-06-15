const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args, guild) => {
    switch(args[0].toLowerCase()){

        case 'niveaux':
            let embedniveaux = new MessageEmbed()
                .setTitle('Informations sur le système de niveaux de <@159985870458322944>')
                .addField("Obtention de l'XP", "Chaque minute passée à envoyer des messages te fait gagner aléatoirement entre 15 et 25 XP.\nPour éviter le spam, le gain d'XP est limité à une fois par minute par utilisateur.\n\nAucun XP n'est attribué dans les salons d'utilisations des bots ainsi que dans les salons staff et no-mic.\n\nIl arrive que la récolte d'XP soit boostée temporairement. Pour être tenu au courant des boosts d'XP, gardez un oeil sur #annonces et récupérez le rôle Élite des Notifs.")
                .addField("Rôles récompense", "Si tu franchis ces niveaux, tu auras le droit à un rôle flambant neuf et même de nouveaux avantages !\n\nNiveau 10 : Habitué\nNiveau 15 : Apprenti Fox\nNiveau 20 : Fox \nNiveau 25 : VIP\nNiveau 35 : Dieu Fox")
                .addField("Commandes et liens connexes", "• https://mee6.gg/pixelfox : Classement du serveur\n• `!rank` : Obtenir son niveau d'XP\n• `!levels` Obtenir le lien vers le classement du serveur\n• `"+ guild.settings.prefix +"infos vip` Obtenir des informations sur le grade VIP et ses avantages\n• `"+ guild.settings.prefix +"help`: Obtenir toutes les commandes d'aide et d'informations")
                .setColor('ORANGE');

            return message.channel.send(embedniveaux)

        case 'bots':
            let embedbots = new MessageEmbed()
                .setTitle("Liste des commandes d'aide des Bots du serveur")
                .setDescription("• <@721337744982540299> : `"+ guild.settings.prefix +"help`\n• <@276060004262477825> : `^^help`\n• <@497894401264058368> : `+help`\n• <@159985870458322944> : `!help`\n• <@235088799074484224> : `r!help`\n• <@284035252408680448> : `%help`\n• <@598553427592871956> : `,help`\n• <@!187636089073172481> : `dh!help`")
                .setColor('ORANGE');
            
            return message.channel.send(embedbots);

        case 'profil':
            let embedprofil = new MessageEmbed()
                .setTitle('Tutoriel : paramétrer vos profils')
                .setDescription("Nous avons départagé votre profil en trois profils afin qu'ils soient plus clairs et agréables à lire.\nAinsi, chacun des trois profils rempli une fonction différente, vous devrez configurer ceux-ci chacun à leur tour. Cela devrait vous prendre au maximum 5 minutes.\n\n- Pour paramétrer le profil \"Profil\" :  `,setprofil`  | Pour l'obtenir :  `,getprofil`\n- Pour paramétrer le profil \"Codesami\"  : `,setcodesami`  | Pour l'obtenir :  `,getcodesami` \n- Pour paramétrer le profil \"Reseaux\" :  `,setreseaux`  | Pour l'obtenir :  `,getreseaux` \n\nNote : Si rien ne se passe après avoir rentré ,set[NomDuProfil], assurez vous que vous pouvez recevoir des MP des membres du serveur.\n\nMerci de respecter les formats demandés lors de la création du profil et d'utiliser un raccourcisseur de liens afin de ne pas encombrer votre profil.\nSi vous avez besoin d'aide, n'hésitez pas à utiliser la commande `,help` ou de nous poser des questions dans <#714791898333577216>.")
                .setColor('ORANGE');

            return message.channel.send(embedprofil);

        default:
            return message.channel.send(`Les arguments spécifiés sont invalides ou inexistants. Utilisation de la commande : \`${guild.settings.prefix}${this.help.name} ${this.help.usage}\``);
    }
};

module.exports.help = {
    name: "aides",
    aliases: ["aides"],
    category : 'important',
    description: "Affiche des panneaux d'aides sur certains sujets",
    usage: "<[niveaux,bots,profil]>",
    args: true,
    permission: false,
};