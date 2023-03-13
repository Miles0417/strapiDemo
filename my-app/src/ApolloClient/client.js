import { ApolloClient, InMemoryCache, ApolloLink, HttpLink} from '@apollo/client'
// import { RestLink } from "apollo-link-rest";

const httpLink = new HttpLink({
  uri: "http://localhost:1337/graphql",
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});