const { createClient } = require('next-sanity');

const client = createClient({
  projectId: 'umgd4ynt',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function run() {
  try {
    const q1 = `*[_type == "post"]`;
    const res1 = await client.fetch(q1);
    console.log('Total posts:', res1.length);
    if (res1.length > 0) {
      console.log('First post publishedAt:', res1[0].publishedAt);
    }
    
    // Test the literal queries from queries.ts
    const latestPostsQuery = `
      *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc, _createdAt desc)[0...6] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt
      }
    `;
    const res2 = await client.fetch(latestPostsQuery);
    console.log('latestPostsQuery results:', res2.length);
    console.log(JSON.stringify(res2, null, 2));
  } catch(e) {
    console.error(e);
  }
}
run();
