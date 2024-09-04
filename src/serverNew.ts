import app from "./app";
import { connectionToDatabase } from "./database/connection";

const PORT = 4000;

const serverStart = async () => {
    try {
        await connectionToDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        process.exit(1);
    }
}

serverStart();