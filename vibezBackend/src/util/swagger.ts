import AuthApiDoc from "../swagger/auth.swagger"
import FriendApiDoc from "../swagger/friend.swagger"
import StorageApiDoc from "../swagger/storage.swagger"

const SwaggerConfig = {
    openapi : "3.0.0",
    info:{
        title: "Vibez Official api",
        description: "All the public and privet api listed here",
        version:"1.0.0",
        contact : {
            name : "saikat Dutta",
            email:"saikat2018dutta18@gmail.com"
        }
    },
    servers : [
        {url : process.env.SERVER_URL}
    ],
    paths:{
        ...AuthApiDoc,
        ...StorageApiDoc,
        ...FriendApiDoc,
    }
}


export default SwaggerConfig