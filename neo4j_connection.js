const neo4j = require('neo4j-driver');

// Replace 'your-password' with the password you set during database creation
const driver = neo4j.driver(
  'bolt://localhost:7687',  // Ensure this matches your Neo4j instance URL
  neo4j.auth.basic('neo4j', 'your-password')  // Replace 'your-password' with your actual password
);

const session = driver.session();

session.run('RETURN 1')
  .then(result => {
    console.log('Database connection successful:', result.records);
    session.close();
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });