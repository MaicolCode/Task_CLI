const { randomUUID } = require('node:crypto')
const fs = require('node:fs')

const { program } = require('commander')

program.version('0.0.1').description('CLI for Tasks')
program
  .command('list')
  .arguments('[status]')
  .action(status => {
    const tasks = JSON.parse(fs.readFileSync('./src/mooks/tasks.json', 'utf8'))

    if (status) {
      console.table(
        tasks
          .map(task => {
            return {
              id: task.id,
              description: task.description,
              status: task.status
            }
          })
          .filter(task => task.status === status)
      )
      return
    }

    console.table(
      tasks.map(task => {
        return { id: task.id, description: task.description, status: task.status }
      })
    )
  })
  .description('List all tasks')

program.command('add <description>').action(description => {
  const tasks = JSON.parse(fs.readFileSync('./src/mooks/tasks.json', 'utf8'))
  const task = {
    id: randomUUID(),
    description,
    status: 'no-done',
    createdAt: new Date().toTimeString(),
    updatedAt: new Date().toTimeString()
  }
  tasks.push(task)
  fs.writeFileSync('./src/mooks/tasks.json', JSON.stringify(tasks))
  console.log(`Task added with id: ${task.id}`)
})

program.command('update <id> <description>').action((id, description) => {
  const tasks = JSON.parse(fs.readFileSync('./src/mooks/tasks.json', 'utf8'))
  const task = tasks.find(task => task.id === id)
  if (!task) {
    console.log('Task not found')
    return
  }
  task.description = description
  task.updatedAt = new Date().toTimeString()
  fs.writeFileSync('./src/mooks/tasks.json', JSON.stringify(tasks))
  console.log(`Task updated with id: ${id} and updatedAt: ${task.updatedAt} `)
})

program.command('remove <id>').action(id => {
  const tasks = JSON.parse(fs.readFileSync('./src/mooks/tasks.json', 'utf8'))
  const task = tasks.find(task => task.id === id)
  if (!task) {
    console.log('Task not found')
    return
  }
  const newTasks = tasks.filter(task => task.id !== id)
  fs.writeFileSync('./src/mooks/tasks.json', JSON.stringify(newTasks))
  console.log(`Task removed with id: ${id}`)
})

program.command('mark <id> <status>').action((id, status) => {
  const tasks = JSON.parse(fs.readFileSync('./src/mooks/tasks.json', 'utf8'))
  const task = tasks.find(task => task.id === id)
  if (!task) {
    console.log('Task not found')
    return
  }

  if (status !== 'done' && status !== 'in-progress') {
    console.log('Status must be done or in-progress')
    return
  }

  task.status = status
  fs.writeFileSync('./src/mooks/tasks.json', JSON.stringify(tasks))
  console.log(`Task marked with id: ${id}`)
})

program.parse()
