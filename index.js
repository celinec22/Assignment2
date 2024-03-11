const express = require('express');
const apiRouter = require('./api');

const app = express();
const PORT = process.env.PORT || 4000;

app.use('/api', apiRouter);


// Start the server and listen on port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
