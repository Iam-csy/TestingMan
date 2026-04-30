import axios from "axios";


export const TestApi = async (req,res)=>{
    const {url,method,body,headers} = req.body;
    if(!url || !method || !body || !headers){
        return res.status(400).json({
            message: "All fields are required"
        })
    }   

    try{
        const response=await axios({
            url,
            method,
            data:body,
            headers
        })
        res.status(200).json(response)
    }catch(error){
        res.status(500).json({
            message: "Error",
            error: error.message
        })
    }
}
