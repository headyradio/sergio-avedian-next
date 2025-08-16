import { GraphQLClient } from 'graphql-request';

// Your Hygraph Content API endpoint
const HYGRAPH_ENDPOINT = 'https://ap-south-1.cdn.hygraph.com/content/cmebfl0oe02kv07utjwx0hlht/master';

// Create GraphQL client with secure API key
export const hygraphClient = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_API_KEY}`,
  },
});

export default hygraphClient;