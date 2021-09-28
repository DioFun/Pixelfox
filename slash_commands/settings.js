const commands = [
    {name: "leaderboard", value: "leaderboard"},
    {name: "rank", value: "rank"},
    {name: "birthday", value: "birthday"},
    {name: "set-support", value: "set-support"},
    {name: "check", value: "check"},
    {name: "permission", value: "permission"},
];
module.exports = [
    {
        name: "leaderboard",
        description: "Affiche le classement actuel d'expérience du serveur"
    },
    {
        name: "rank",
        description: "Affiche son expérience ou celle d'un membre",
        options: [{
            type: "USER",
            name: "membre",
            description: "Membre ciblé",
            required: false
        }]
    },
    {
        name: "birthday",
        description: "Affiche sa date d'anniversaire ou celle d'un membre.",
        options: [
            {
                name: "member",
                description: "Membre ciblé",
                type: "USER"
            }
        ]
    },
    {
        name: "set-support",
        description: "Défini le salon de support ainsi que la catégorie ou les tickets seront créés.",
        options: [
            {
                name: "salon",
                description: "Salon où les tickets pourront être ouverts.",
                type: "CHANNEL",
            }
        ],
        defaultPermission: false
    },
    {
        name: "check",
        description: "Commande dev"
    },
    {
        name: "permission",
        description: "Permet de gérer l'accès aux commandes.",
        options: [
            {
                name: "grant",
                description: "Ajoute à un rôle ou un utilisateur l'accès à une commande.",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "commande",
                        description: "Commande ciblée",
                        required: true,
                        type: 3,
                        choices: commands
                    },
                    {
                        name: "mention",
                        description: "Membre ou rôle ciblé",
                        required: true,
                        type: "MENTIONABLE"
                    }
                ]
            },
            {
                name: "remove",
                description: "Supprime à un rôle ou un utilisateur l'accès à une commande.",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "commande",
                        description: "Commande ciblée",
                        required: true,
                        type: 3,
                        choices: commands
                    },
                    {
                        name: "mention",
                        description: "Membre ou rôle ciblé",
                        required: true,
                        type: "MENTIONABLE"
                    }
                ]
            }, 
            {
                name: "prohibit",
                description: "Interdit à un rôle ou un utilisateur l'accès à une commande.",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "commande",
                        description: "Commande ciblée",
                        required: true,
                        type: 3,
                        choices: commands
                    },
                    {
                        name: "mention",
                        description: "Membre ou rôle ciblé",
                        required: true,
                        type: "MENTIONABLE"
                    }
                ]
            },
            {
                name: "view",
                description: "Permet de voir les accès accordées à une commande.",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "commande",
                        description: "Commande ciblée",
                        required: true,
                        type: 3,
                        choices: commands
                    }
                ]
            }
        ],
        defaultPermission: false
    }
];