import mongoose  from "mongoose"

const connectDB = async(url)=>{
    try {
        await mongoose.connect(url)
        console.log("Database Connected");
    } catch (error) {
        console.log(`Error Occured In Database ${error}`)
    }
}

export default connectDB