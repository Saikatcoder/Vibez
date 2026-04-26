import { Router } from "express";
import { addFriend, fetchFrends, friendRequest, friendSuggestion, unFriend, updateFriendStatus } from "../controller/friend.controller";

const FriendRouter = Router()

FriendRouter.post('/add-friend',addFriend)
FriendRouter.put('/:id',updateFriendStatus)
FriendRouter.get('/fetch-friends', fetchFrends)
FriendRouter.get('/suggestion',friendSuggestion)
FriendRouter.get('/request',friendRequest)
// FriendRouter.get('/stats', getUserStats)
FriendRouter.delete("/:id",unFriend)

export default FriendRouter