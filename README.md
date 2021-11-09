# Bit-Brothers

### System Requirements

- You should have NodeJs, Postman and MongoDB installed
- After installation, come into the root directory of the assignment (having README.md file)
- In the command line run - npm install package.json
- Then run the server (node index.js)

### How to test
- POST (to create a user) request to localhost:3000/user - body of the request = { name, email, password }
- GET (to login a user) request to localhost:3000/user - body of the request = { email, password }
- PUT (to update a user) request to localhost:3000/user - body of the request = { newUsername, newEmail }
- DELETE (to delete a user) request to localhost:3000/user
- There is authorization in place, i.e. only the user which is logedin can update/delete his own profile
