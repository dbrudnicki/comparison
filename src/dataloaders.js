const DataLoader = require('dataloader')
const db = require('../models/index')

/**
 * DataLoader implementations.
 */
exports.taskLoader = new DataLoader(async keys => {
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

exports.tsLoader = new DataLoader(async keys => {
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
