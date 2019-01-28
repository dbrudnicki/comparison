const { GraphQLServer } = require('graphql-yoga')
const DataLoader = require('dataloader')
const { json } = require('body-parser')
const db = require('../models/index')

const PORT = 5000

// Used for checking the query time
let start = 0
let operName = ''

/**
 * Uses map and forEach to increase speed of data transform.
 */
const dataLoader = new DataLoader(async keys => {
  const tasks = await db.Tasks.findAll({
    where: {
      jobId: {
        [db.Op.in]: keys
      }
    }
  })

  const result = keys.reduce((acc, key) => {
    acc.push(tasks.filter(t => t.jobId === key))
    return acc
  }, [])

  return result
})

/**
 * The schema type definitons.
 */
const typeDefs = `
  type Task {
    id: Int!
    name: String!
  }

  type Job {
    id: Int!
    name: String!
    buildPart: String
    tasks: [Task!]!
    Tasks: [Task!]!
  }

  type Query {
    dataLoaderJobs: [Job!]!
    joinedJobs: [Job!]!
  }
`

/**
 * Resolvers.
 */
const resolvers = {
  Job: {
    tasks: ({ id }) => dataLoader.load(id)
  },
  Query: {
    dataLoaderJobs: async () => await db.Jobs.findAll(),
    joinedJobs: async () => {
      const resp = await db.Jobs.findAll({
        include: db.Tasks
      })
      return resp
    }
  }
}

// Create the server
const server = new GraphQLServer({
  typeDefs,
  resolvers
})

// Set up the express middleware for json body parsing
server.express.use(json())

// Middleware to track fulfillment duration
server.express.use((req, res, next) => {
  operName = req.body.operationName
  start = new Date().getTime()

  res.on('finish', () => {
    console.log(`${operName} Time: ${new Date().getTime() - start} ms.`)
    dataLoader.clearAll()
  })

  next()
})

// Start the server
server.start({ port: PORT }, () => {
  console.log(`Server started on port: ${PORT}`)
})
