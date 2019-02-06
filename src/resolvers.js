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
    dataLoaderJobs: () => db.Jobs.findAll(),
    joinedJobs: async (node, args, ctx, info) => {
      const start = new Date().getTime()
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
      console.log(`${new Date().getTime() - start} ms.`)
      return resp
    }
  }
}
