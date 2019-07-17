import { DEV_DISCORD_ID, DOC_URI } from './config'

const AEIC_BOT_HELP = `Pour des raisons de lisibilité du chat, les commandes sont répertoriées ici : ${DOC_URI}.
Questions ? Suggestions ? MP le développeur de l'AEIC-BOT <@${DEV_DISCORD_ID}>.
Repository GitHub du bot : https://github.com/rigwild/aeic-bot2.`

const WELCOME = {
  WELCOME_DM: `**Ce message est automatique, je ne peux pas répondre aux messages privés.** :sweat_smile:
Bienvenue sur le Discord de l'**AEIC** ! Je suis l'**AEIC-BOT**. :robot:
Mes commandes te seront peut être utiles. Elles sont à utiliser **sur le serveur Discord de l'AEIC.**
Pour éviter de gêner les autres membres avec mes longs messages, pense à m'utiliser dans le channel <#486230915593273344>. :eyes:
Tu peux afficher la liste de mes commandes en utilisant la commande \`!aide\`. :book:
Il est par exemple possible de choisir ton groupe de classe, voir ton planning ou encore trouver le mail d'un prof (Et plein d'autres trucs).
Commence par choisir ton groupe de classe et ta maison d'asso (**sur le serveur discord AEIC**) :ok_hand:
\`!choisirGroupe tp1a\` ("tp" + Année d'étude + Groupe TP / OU ulco / OU invité)
\`!choisirMaison omega\` (Omega, Theta, Sigma ou Delta)
Allez, j'arrête mon spam ! :nerd: Tu peux voir l'ensemble de mes commandes sur ce site : ${DOC_URI}.`,

  WELCOME_PUBLIC: (userId: string) => `Bienvenue sur le Discord de l'AEIC <@${userId}> ! Je t'ai envoyé un message privé pour t'expliquer mon fonctionnement. :wink:`
}

const needHelp = `Rends-toi sur ${DOC_URI} pour obtenir de l'aide sur les commandes.`

export default {
  AEIC_BOT_HELP,
  ...WELCOME,
  ROLE_GROUPE_INEXISTANT: `Le groupe de classe indiqué n'existe pas. ${needHelp}`,
  ROLE_GROUPE_AJOUTE: 'Les rôles de groupe de classe ont été appliqués.',
  ROLE_MAISON_INEXISTANT: `La maison indiquée n'existe pas. ${needHelp}`,
  ROLE_MAISON_AJOUTE: 'Le rôle de maison a été appliqué.',
  CHANNEL_CLASSE_SEULEMENT: `La commande "#toReplace#" n'est utilisable que dans le channel de ta classe. ${needHelp}`,
  MANQUE_ARGUMENT: `Il manque des arguments à la commande "#toReplace#". ${needHelp}`,
  ARGUMENT_INVALIDE: `Les arguments entrés pour la commande "#toReplace#" sont invalides. ${needHelp}`,
  AUCUN_DEVOIR: `Il n'y a aucun devoir **enregistré** pour ce groupe. ${needHelp}`,
  PLANNING_VIDE: `Le planning pour ce groupe est vide. **Attention** ! Cela peut être un bug. ${needHelp}`,
  COMMANDE_DEVELOPPEUR: `La commande "#toReplace#" est réservée au développeur du bot. <@${DEV_DISCORD_ID}>`,
  MAUVAIS_FORMAT_DATE: 'Le format de date est incorrect.',

  UNKNOWN_COMMAND: (command: string) => `La commande \`${command}\` n'existe pas. ${needHelp}`,
  INVALID_COMMAND_ARGUMENT_NUMBER: (command: string, numberArgs: number, minArgs: number, maxArgs?: number) => `Le nombre d'arguments passés (${numberArgs}) pour la commande \`${command}\` est invalide. Le nombre minimum d'arguments est de ${minArgs} et le maximum de ${maxArgs || 'infini'}. ${needHelp}`,
  ERREUR_NON_DECRITE: `Une erreur non décrite s'est produite. Help <@${DEV_DISCORD_ID}> ! Commande : "#toReplace#".`,
  ERREUR_NON_DECRITE_LOG: `Une erreur non décrite s'est produite. Help <@${DEV_DISCORD_ID}> ! Commande : "#toReplace#". \`\`\`#logMessage#\`\`\``
}
