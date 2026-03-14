import { Router } from "express";
import { addFriend, fetchFrends, friendSuggestion } from "../controller/friend.controller";

const FriendRouter = Router()

FriendRouter.post('/add-friend',addFriend)
FriendRouter.get('/fetch-friends', fetchFrends)
FriendRouter.get('/suggestion',friendSuggestion)

export default FriendRouter