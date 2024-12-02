/**
 * QUESTO E' UN FILE CENTRALIZZATO PER CONTENERE TUTTI I MODELLI, I REPOSITORY
 * CHIAMERANNO QUESTO FILE PER INCLUDERE I VARI MODELLI.
 */

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
const { Role } = require('./Role');




/**
  * MANY TO MANY (HashPermissions)
*/
Hash.belongsToMany(Permissions, { through: HashPermissions, foreignKey: 'hash_id', otherKey: 'permission_id' });
Permissions.belongsToMany(Hash, { through: HashPermissions, foreignKey: 'permission_id', otherKey: 'hash_id' });

/**
  * MANY TO MANY (GuilEnabledFeatures)
*/
Guild.belongsToMany(Feature, { through: GuildEnabledFeatures, foreignKey: 'guild_id', otherKey: 'feature_id', sourceKey: 'guild_id'});
Feature.belongsToMany(Guild, { through: GuildEnabledFeatures, foreignKey: 'feature_id', otherKey: 'guild_id'});

/**
 * MANY TO MANY (UserGuild)
*/
Guild.belongsToMany(User, { through: UserGuild, foreignKey: 'user_id', otherKey: 'user_id' });
User.belongsToMany(Guild, { through: UserGuild, foreignKey: 'guild_id', otherKey: 'guild_id' });

/**
 *  ONE TO ONE (AutoRoles)
 */
Role.hasOne(AutoRoles, { foreignKey: 'role_id', sourceKey: 'role_id' });
AutoRoles.belongsTo(Role, { foreignKey: 'role_id', targetKey: 'role_id' });

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
  Role,
}