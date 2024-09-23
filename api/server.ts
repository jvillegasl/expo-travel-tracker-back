import dotenv from "dotenv";

import app from ".";

dotenv.config({ path: ".env.development.local" });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));
