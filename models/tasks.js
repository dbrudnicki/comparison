'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tasks = sequelize.define('Tasks', {
    name: DataTypes.STRING
  })

  Tasks.associate = models => {
    Tasks.belongsTo(models.Jobs, { foreignKey: 'jobId' })
  }

  return Tasks
}
