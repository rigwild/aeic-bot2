const { promises: fs } = require('fs')
const { resolve: r } = require('path')
const { commands } = require('./dist/commands')

const docsPath = r(__dirname, 'docs')

const summaryTemplate = commands => `# List of commands
${commands.map(aCommand => ` - [${aCommand.command}](#${aCommand.command})`).join('\n')}

---
`

const documentationTemplate = command => `## ${command.command}
### Description
${command.description}

### Arguments
| Minimum | Maximum |
| :-----: |  :----: |
| ${command.minArgs} | ${command.maxArgs} |

### Example(s)
${command.examples.map(anExample => `\`\`\`\n${anExample}\n\`\`\``).join('\n')}
`

const fullTemplate = commands => `${summaryTemplate(commands)}
${commands.map(aCommand => documentationTemplate(aCommand)).join('\n---\n\n')}`


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
