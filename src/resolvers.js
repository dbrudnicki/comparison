const db = require('../models/index')
const { taskLoader, tsLoader } = require('./dataloaders')

module.exports = {
  Task: {
    timeSegments: ({ id }) => tsLoader.load(id)
  },
  Job: {
    tasks: ({ id }) => taskLoader.load(id)
  },
  Query: {
    dataLoaderJobs: async () => {
      taskLoader.clearAll()
      tsLoader.clearAll()
      const jobs = await db.Jobs.findAll()
      return jobs
    },
    joinedJobs: async (node, args, ctx, info) => {
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
