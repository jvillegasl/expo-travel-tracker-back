import dotenv from "dotenv";

dotenv.config({ path: ".env.development.local" });

import app from ".";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));
