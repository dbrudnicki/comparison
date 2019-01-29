const { GraphQLServer } = require('graphql-yoga')
const DataLoader = require('dataloader')
const { json } = require('body-parser')
const db = require('../models/index')

const PORT = process.env.PORT || 5000

// Used for checking the query time
let start = 0
let operName = ''

/**
 * DataLoader implementations.
 */
const taskLoader = new DataLoader(async keys => {
  const tasks = await db.Tasks.findAll({
    where: {
      jobId: {
        [db.Op.in]: keys
      }
    }
  })

  const keyMap = new Map(keys.map(k => [k, []]))

  tasks.forEach(t => {
    keyMap.get(t.jobId).push(t)
  })

  return [...keyMap.values()]
})

const tsLoader = new DataLoader(async keys => {
  const tsList = await db.TimeSegments.findAll({
    where: {
      taskId: {
        [db.Op.in]: keys
      }
    }
  })

  const keyMap = new Map(keys.map(k => [k, []]))

  tsList.forEach(ts => {
    keyMap.get(ts.taskId).push(ts)
  })

  return [...keyMap.values()]
})

/**
 * The schema type definitons.
 */
const typeDefs = `
  type TimeSegment {
    id: Int!
    displayName: String
    duration: Int
    sequence: Int
  }

  type Task {
    id: Int!
    name: String!
    timeSegments: [TimeSegment!]!
    TimeSegments: [TimeSegment!]!
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
  Task: {
    timeSegments: ({ id }) => tsLoader.load(id)
  },
  Job: {
    tasks: ({ id }) => taskLoader.load(id)
  },
  Query: {
    dataLoaderJobs: async () => await db.Jobs.findAll(),
    joinedJobs: async () => {
      const resp = await db.Jobs.findAll({
        include: [
          {
            model: db.Tasks,
            include: [
              {
                model: db.TimeSegments
              }
            ]
          }
        ]
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
    taskLoader.clearAll()
    tsLoader.clearAll()
  })

  next()
})

// Start the server
server.start({ port: PORT }, () => {
  console.log(`Server started on port: ${PORT}`)
})
