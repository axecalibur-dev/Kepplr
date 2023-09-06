export const mongo_connect_string = () => {
  return `${process.env.MONGO_CONNECTION_PREFIX}://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PWD}@${process.env.MONGO_DB_IP}/${process.env.MONGO_CONNECT_SUFFIX}`;
};
