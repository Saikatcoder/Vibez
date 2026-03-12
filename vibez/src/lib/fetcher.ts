import HttpInterceptor from "./Htttpinterceptor"

const Fetcher = async (url:string) =>{
    try {
      const {data} =   await HttpInterceptor.get(url)
      return data
    } catch (error : any) {
        throw new Error("Failed to fetch data")
    }
}

export default Fetcher