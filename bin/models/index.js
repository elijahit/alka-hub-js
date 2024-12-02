const { Hash } = require('./Hash');
const { Permissions } = require('./Permissions');
const { HashPermissions } = require('./HashPermissions');
const { AutoRoles } = require('./AutoRoles');
const { AutoVoice } = require('./AutoVoice');
const { Feature } = require('./Feature');
const { Guild } = require('./Guild');
const { GuildEnabledFeatures } = require('./GuildEnabledFeatures');
const { User } = require('./User');
const { UserGuild } = require('./UserGuild');




/**
  * MANY TO MANY (HashPermissions)
*/
Hash.belongsToMany(Permissions, { through: HashPermissions, foreignKey: 'hash_id', otherKey: 'permission_id' });
Permissions.belongsToMany(Hash, { through: HashPermissions, foreignKey: 'permission_id', otherKey: 'hash_id' });

/**
  * MANY TO MANY (GuilEnabledFeatures)
*/
Guild.belongsToMany(Feature, { through: GuildEnabledFeatures, foreignKey: 'guild_id', otherKey: 'feature_id' });
Feature.belongsToMany(Guild, { through: GuildEnabledFeatures, foreignKey: 'id', otherKey: 'guild_id' });

/**
 * MANY TO MANY (UserGuild)
*/
Guild.belongsToMany(User, { through: UserGuild, foreignKey: 'user_id', otherKey: 'user_id' });
User.belongsToMany(Guild, { through: UserGuild, foreignKey: 'guild_id', otherKey: 'guild_id' });

module.exports = {
  Hash,
  Permissions,
  HashPermissions,
  AutoRoles,
  AutoVoice,
  Feature,
  Guild,
  GuildEnabledFeatures,
  UserGuild,
  User,
}