import { Relationships } from "./relationships";
import { Users } from "./users";

const build_sequelize_associations = () => {
  console.log("Called");
  Relationships.belongsTo(Users, {
    foreignKey: "personA",
    as: "personAData",
  });

  Relationships.belongsTo(Users, {
    foreignKey: "personB",
    as: "personBData",
  });

  Users.hasMany(Relationships, {
    foreignKey: "personA",
    as: "personARelationships",
  });

  Users.hasMany(Relationships, {
    foreignKey: "personB",
    as: "personBRelationships",
  });
};

export default build_sequelize_associations;
