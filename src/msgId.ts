import { DEV_DISCORD_ID, DOC_URI } from './config'
import { toHumanDate } from './commands/utils'
import { Homework } from './database/TpGroup'

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
  TP_GROUP_ROLE_ADDED: (tpGroup: string) => `Le rôle de groupe de TP \`${tpGroup}\` a été appliqué.`,

  NO_HOMEWORK: (tpGroup: string) => `Il n'y a aucun devoir **enregistré** pour le groupe de TP \`${tpGroup}\`.`,
  HOMEWORK_ADDED: (homework: Homework, tpGroup: string) => `Un devoir pour le \`${toHumanDate(homework.dueDate)}\` du cours \`${homework.subject}\` a été ajouté au groupe de TP \`${tpGroup}\`.\`\`\`${homework.content}\`\`\``,
  HOMEWORK_ADDED_VIA_TD: (homework: Homework, tpGroup: string, authorId: string) => `Un devoir pour le \`${toHumanDate(homework.dueDate)}\` du cours \`${homework.subject}\` a été ajouté au groupe de TP \`${tpGroup}\` par <@${authorId}> (ajout de devoir via groupe de TD).\`\`\`${homework.content}\`\`\``,
  HOMEWORK_SHOW: (homework: Homework) => `Pour le \`${toHumanDate(homework.dueDate)}\` du cours \`${homework.subject}\`\nAjouté le \`${toHumanDate(homework.addedDate)}\` par <@${homework.authorId}> \`\`\`${homework.content}\`\`\``,

  // PLANNING_VIDE: `Le planning pour ce groupe est vide. **Attention** ! Cela peut être un bug. ${needHelp}`,
  // COMMANDE_DEVELOPPEUR: `La commande "#toReplace#" est réservée au développeur du bot. <@${DEV_DISCORD_ID}>`,

  INVALID_DATE: `Le format de date est incorrect. ${needHelp}`,
  DATE_IN_PAST: `La date ne peut pas être dans le passé. ${needHelp}`,

  NOT_IN_CHANNEL: (...channel: string[]) => `La commande ne peut être exécutée que dans les channels : \`${channel.join(', ')}\`. ${needHelp}`,
  MISSING_ROLE: (role: string) => `Le rôle \`${role}\` est nécessaire pour exécuter cette commande. ${needHelp}`,
  MISSING_ROLE_SOME: (roles: string[]) => `Un des rôles \`${roles.toString()}\` est nécessaire pour exécuter cette commande. ${needHelp}`,
  UNKNOWN_GROUP_TD: (tdGroup: string, yearGroup: string) => `Le groupe de TD \`${tdGroup}\` du group d'année \`${yearGroup}\` n'existe pas. ${needHelp}`,
  UNKNOWN_GROUP_TP: (tpGroup: string) => `Le groupe \`${tpGroup}\` n'existe pas. ${needHelp}`,
  UNKNOWN_CHANNEL: (channel: string) => `Le channel \`${channel}\` n'existe pas.`,
  UNKNOWN_COMMAND: (command: string) => `La commande \`${command}\` n'existe pas. ${needHelp}`,
  INVALID_COMMAND_ARGUMENT_NUMBER: (command: string, numberArgs: number, minArgs: number, maxArgs?: number) => `Le nombre d'arguments passés (${numberArgs}) pour la commande \`${command}\` est invalide. Le nombre minimum d'arguments est de ${minArgs} et le maximum de ${maxArgs || 'infini'}. ${needHelp}`
}
