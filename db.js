import mongoose from "mongoose";

const connection = async() => {
    // const url = "mongodb+srv://admin:admin@cluster0.5zq7n.mongodb.net/MyDB?retryWrites=true&w=majority";
    const url=`mongodb+srv://abhi:abhi@cluster0.3om19eg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    // const url = "mongodb://localhost:27017/local";
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connection is successful");
    }).catch((err) => {

        console.log("No connection");
        console.log(err);
        process.exit(1)
    });

}

export default connection;