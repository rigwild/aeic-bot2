const { promises: fs } = require('fs')
const { resolve: r } = require('path')
const { commands } = require('./dist/commands')
const { ARG_SEPARATOR, COMMAND_TRIGGER } = require('../core/dist/config')

const docsPath = r(__dirname, 'docs')

// Table of contents
const summaryTemplate = commands =>
  ` - [Tutoriel](#tutoriel)
 - [Liste des commandes](#liste-des-commandes)
${commands.map(aCommand => `   - [\`${COMMAND_TRIGGER}${aCommand.command}\`](#${aCommand.command})`).join('\n')}`

// A command documentation
const documentationTemplate = command => `### \`${COMMAND_TRIGGER}${command.command}\`
#### Description
${command.description}

#### Arguments
| Minimum | Maximum |
| :-----: |  :----: |
| ${command.minArgs} | ${command.maxArgs} |

#### Exemple(s)
${command.examples.map(anExample => `\`\`\`\n${anExample}\n\`\`\``).join('\n')}`


// The full template
const fullTemplate = commands =>
  `# Table des matières
${summaryTemplate(commands)}

---

## Tutoriel
Pour lancer une commande, votre message doit commencer par \`${COMMAND_TRIGGER}\`, suivi d'une commande existante.

Une commande peut nécessiter des arguments. Si un seul est nécessaire, vous pouvez taper votre commande suivie par l'argument à renseigner :
\`\`\`sh
${COMMAND_TRIGGER}unExemple monArgument
${COMMAND_TRIGGER}unExemple ceci compte comme un seul argument
\`\`\`

Dans le cas ou plusieurs arguments sont nécessaires, vous pouvez les séparer à l'aide de \`${ARG_SEPARATOR}\` :
\`\`\`sh
${COMMAND_TRIGGER}unExemple ceci compte comme un seul argument ${ARG_SEPARATOR} celui-ci est le deuxième argument
\`\`\`

Les commandes et leurs arguments ne sont pas sensibles à la casse, les commandes suivantes provoqueront le même résultat :
\`\`\`sh
${COMMAND_TRIGGER}unExemple
${COMMAND_TRIGGER}UnexEmpLe
\`\`\`

## Liste des commandes
${commands.map(aCommand => documentationTemplate(aCommand)).join('\n\n---\n\n')}
`


const setup = async () => {
  const commandsList = Object.values(commands).map(aCommand => aCommand.meta).sort((a, b) => {
    if (a.command < b.command) return -1
    if (a.command > b.command) return 1
    return 0
  })
  const commandsListNames = Object.keys(commands).sort()

  console.log(`Commands list (${commandsListNames.length}):`, commandsListNames)

  // Create the `/docs` directory
  await fs.mkdir(docsPath, { recursive: true })

  // Generate the documentation
  console.log('Generating documentation...')
  await fs.writeFile(r(docsPath, `index.md`), fullTemplate(commandsList))
  console.log('Documentation generated.')
}

setup()
