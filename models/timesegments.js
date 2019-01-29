'use strict'
module.exports = (sequelize, DataTypes) => {
  const TimeSegments = sequelize.define('TimeSegments', {
    duration: DataTypes.INTEGER,
    displayName: DataTypes.STRING,
    taskId: DataTypes.INTEGER,
    sequence: DataTypes.INTEGER
  })

  TimeSegments.associate = models => {
    TimeSegments.belongsTo(models.Tasks, { foreignKey: 'taskId' })
  }

  return TimeSegments
}
