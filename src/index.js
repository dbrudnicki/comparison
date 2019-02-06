const { GraphQLServer } = require('graphql-yoga')
const fs = require('fs')
const typeDefs = fs.readFileSync(`${__dirname}/typeDefs.graphql`, 'utf8')
const resolvers = require('./resolvers')

const PORT = process.env.PORT || 5000

// Create the server
const server = new GraphQLServer({
  typeDefs,
  resolvers
})

// Start the server
server.start({ port: PORT }, () => {
  console.log(`Server started on port: ${PORT}`)
})
