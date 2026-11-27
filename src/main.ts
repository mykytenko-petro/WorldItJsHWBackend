import { createApp } from "./app";
import { createConfig } from "./config";

const config = createConfig();

const app = createApp(config);

app.listen(config.serverPort, () => {
    console.log(`Server is running on http://127.0.0.1:${config.serverPort}`);
});
