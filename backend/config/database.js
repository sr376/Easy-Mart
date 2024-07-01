import { connect } from "mongoose";

const connectDatabase = () => {
  connect(process.env.DB_URL)
    .then((data) => {
      console.log(`MongoDB connected with server : ${data.connection.host}`);
    })
    
};

export default connectDatabase;
