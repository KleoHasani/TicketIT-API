(() => {
  ("use strict");
  const { connect, connection } = require("mongoose");

  // Connect
  connect(process.env.MONGO_URI.toString(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 5000,
  })
    .then(() => {
      console.log("MongoDB: Connected");
    })
    .catch((err) => {
      console.error(err);
      connection
        .close()
        .then(() => {
          console.log("MongoDB: Unable to connect");
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          process.exit(0);
        });
    });

  // Node process interupt
  process.on("SIGINT", () => {
    connection
      .close()
      .then(() => {
        console.log("MongoDB: Disconnected");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        process.exit(0);
      });
  });
})();
