if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");

const typeDefs = gql`
  type Pokemon {
    results: [result]
  }
  type PokemonDetail {
    name: String
    base_hapiness: Int
    capture_rate: Int
    color: Color
    egg_groups: [egg_group]
  }
  type Color {
    name: String
  }
  type egg_group {
    name: String
  }
  type result {
    name: String
    url: String
  }
  type Query {
    getPokemons: Pokemon
    getPokemonDetail(id: ID!): PokemonDetail
  }
`;

const resolvers = {
  Query: {
    getPokemons: async () => {
      return axios({
        method: "GET",
        url: "https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=20",
      })
        .then(({ data }) => {
          return data;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
    getPokemonDetail: async (_, args) => {
      return axios({
        method: "GET",
        url: "https://pokeapi.co/api/v2/pokemon-species/" + args.id,
      })
        .then(({ data }) => {
          return data;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`server ready at ${url}`);
});
