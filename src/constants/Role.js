const Roles = ["admin", "user"];

const RolesEnum = Roles.reduce((roleEnum, role) => {
  return { ...roleEnum, [role.toUpperCase()]: role };
}, {});

module.exports = {
  Roles,
  RolesEnum,
};
