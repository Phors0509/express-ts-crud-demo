import app from "./app";
import { connectionToDatabase } from "./database/connection";
import config from "./config";

const serverStart = async () => {
    try {
        await connectionToDatabase();
        app.listen(config.PORT, () => {
            console.log(`Server is running on port ${config.PORT}`);
        });
    } catch (err) {
        process.exit(1);
    }
}

serverStart();