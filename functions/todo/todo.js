const { ApolloServer, gql } = require('apollo-server-lambda');
var faunadb = require('faunadb'),
  q = faunadb.query;




const typeDefs = gql`
  type Query {
    todos: [Todo]
  }
  type Todo {
    id: ID!
    description: String!
  }
  type Mutation {
    addTodo(description: String!): Todo
  }
`
const resolvers = {
  Query: {
    todos: async (root, args, context) => {
     // return todo_list
     try{
        var adminClient = new faunadb.Client({secret : "fnAD-oDYnaACBy5LoMYhrMwhQqC11veTyWgczZeF"})
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('todos_by_user'))),
            q.Lambda(x => q.Get(x))
          )
       
        )
        console.log(result.data)
        return result.data.map(d=>{
            return{
              id: d.ts,
              description: d.data.description
            }
        })
        // return[{
        //   description : "hello",
        //   id : 1
        // }]
     }
     catch(err){
       console.log(err)
     }
    },
  },
  Mutation: {
    addTodo: async (_, { description }) => {
      try {
        var adminClient = new faunadb.Client({ secret: "fnAD-oDYnaACBy5LoMYhrMwhQqC11veTyWgczZeF"});
        const result = await adminClient.query(
          q.Create(
            q.Collection('todos'),
            { data: { 
              description: description,

            } },
          )
        )
          return result.ref.data
      }
      catch(err){
        console.log(err)
      }


    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()