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
const { GuildEnabledFeature } = require('./GuildEnabledFeature');
const { User } = require('./User');
const { UserGuild } = require('./UserGuild');
const { Role } = require('./Role');
const { Config } = require('./Config');
const { LogsSystem } = require('./LogsSystem');
const { Statistics } = require('./Statistics');
const { Level } = require('./Level');




/**
  * MANY TO MANY (HashPermissions)
*/
Hash.belongsToMany(Permissions, { through: HashPermissions, foreignKey: 'hash_id', otherKey: 'permission_id' });
Permissions.belongsToMany(Hash, { through: HashPermissions, foreignKey: 'permission_id', otherKey: 'hash_id' });

/**
  * MANY TO MANY (GuilEnabledFeatures)
*/
Guild.belongsToMany(Feature, { through: GuildEnabledFeature, foreignKey: 'guild_id', otherKey: 'feature_id', sourceKey: 'guild_id'});
Feature.belongsToMany(Guild, { through: GuildEnabledFeature, foreignKey: 'feature_id', otherKey: 'guild_id'});

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

/**
 * ONE TO MANY (AutoVoice)
 */
AutoVoice.hasMany(Guild, { foreignKey: 'guild_id' });

/**
 * ONE TO ONE (LogsSystem)
 */
LogsSystem.hasOne(Guild, { foreignKey: 'guild_id' });

module.exports = {
  Hash,
  Permissions,
  HashPermissions,
  AutoRoles,
  AutoVoice,
  Feature,
  Guild,
  GuildEnabledFeature,
  UserGuild,
  User,
  Role,
  Config,
  LogsSystem,
  Statistics,
  Level
}