const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const actual = getUserByEmail("user@example.com", testUsers)
    const expected = testUsers.userRandomID
    assert.equal(actual, expected )
  });
  it('should return undefined if non existent email', function() {
    const actual = getUserByEmail("use1r@example.com", testUsers)
    const expected = falsecd;
    assert.equal(actual, expected )
  });
});

//Inside the same describe statement, add another it statement to test that a non-existent email returns undefined