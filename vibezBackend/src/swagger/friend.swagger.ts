const FriendApiDoc = {
  "/friend/add-friend": {
    post: {
      summary: "Send friend request",
      description: "Send a friend request to another user",
      tags: ["Friend"],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              userId: "user_id_here"
            }
          }
        }
      },

      responses: {
        200: {
          description: "Friend request sent",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "Friend request sent"
              }
            }
          }
        },
        400: { description: "Bad request" },
        401: { description: "Unauthorized" }
      }
    }
  },

  "/friend/{id}": {

    put: {
      summary: "Update friend request status",
      description: "Accept or reject a friend request",
      tags: ["Friend"],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              status: "accepted" // or "rejected"
            }
          }
        }
      },

      responses: {
        200: {
          description: "Status updated",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "Friend request accepted"
              }
            }
          }
        }
      }
    },

    delete: {
      summary: "Unfriend user",
      description: "Remove a friend",
      tags: ["Friend"],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],

      responses: {
        200: {
          description: "Friend removed",
          content: {
            "application/json": {
              example: {
                success: true,
                message: "Friend removed"
              }
            }
          }
        }
      }
    }
  },

  "/friend/fetch-friends": {
    get: {
      summary: "Get all friends",
      description: "Fetch all accepted friends of logged-in user",
      tags: ["Friend"],

      responses: {
        200: {
          description: "Friends fetched",
          content: {
            "application/json": {
              example: {
                success: true,
                friends: [
                  {
                    _id: "123",
                    friend: {
                      fullname: "John Doe",
                      image: "https://img.com/profile.jpg"
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },

  "/friend/suggestion": {
    get: {
      summary: "Friend suggestions",
      description: "Get suggested users to add as friends",
      tags: ["Friend"],

      responses: {
        200: {
          description: "Suggestions fetched",
          content: {
            "application/json": {
              example: {
                success: true,
                users: [
                  {
                    _id: "123",
                    fullname: "Jane Doe",
                    image: "https://img.com/profile.jpg"
                  }
                ]
              }
            }
          }
        }
      }
    }
  },

  "/friend/request": {
    get: {
      summary: "Friend requests",
      description: "Get pending friend requests",
      tags: ["Friend"],

      responses: {
        200: {
          description: "Requests fetched",
          content: {
            "application/json": {
              example: {
                success: true,
                requests: [
                  {
                    _id: "123",
                    sender: {
                      fullname: "Alex",
                      image: "https://img.com/profile.jpg"
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  }

}

export default FriendApiDoc