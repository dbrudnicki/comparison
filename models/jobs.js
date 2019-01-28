'use strict'
module.exports = (sequelize, DataTypes) => {
  const Jobs = sequelize.define('Jobs', {
    name: DataTypes.STRING,
    buildPart: DataTypes.STRING
  })

  Jobs.associate = models => {
    Jobs.hasMany(models.Tasks, { foreignKey: 'jobId' })
  }

  return Jobs
}
