const { Octokit } = require("@octokit/rest");

// use ockit to create a new repo
const clientWithAuth = new Octokit({
    auth: "token "
});

clientWithAuth.repos.createForAuthenticatedUser({
    name: "test2",
    description: "test",
    private: false
}).then(function(response) {
    // console.log(response);
});