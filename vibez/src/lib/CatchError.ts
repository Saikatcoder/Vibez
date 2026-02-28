import axios from "axios"
import { toast } from "react-toastify";

const CatchError = (err : unknown) => {
 if(axios.isAxiosError(err)){
        if(err instanceof Error){
            return toast.error(err.message);
        }
    }
   return toast.error("Network error. Please try again later.");
}

export default CatchError
