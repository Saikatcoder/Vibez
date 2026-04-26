import axios from "axios"
import { toast } from "react-toastify";

const CatchError = (err : unknown, position : 'top-center') => {
 if(axios.isAxiosError(err))
    return toast.error(err.response?.data?.message || err.message, {position})

        if(err instanceof Error){
            return toast.error(err.message);
        }
   return toast.error("Network error. Please try again later.", {position});
}

export default CatchError
