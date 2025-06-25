import { app, initializeDataFile } from "../app";

const port = 3000;

initializeDataFile().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});