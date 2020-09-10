if (!process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
  console.log(
    "Error: MONGODB_USERNAME or MONGODB_PASSWORD not found in env file"
  );
  process.exit(1);
}
