---
sidebar_position: 3
---

# Permissions

The Admin Ranks system by Alka has been designed as a sophisticated permission management mechanism based on hashes. Through the use of a relational database, the system can verify whether a particular role within the Discord server is associated with a specific hash, allowing or denying access to certain systems or commands. Each system within the Alka network, as described in its respective documentation, includes a section dedicated to hashes that can be configured through the Admin Ranks system to regulate access to various features or commands that require permissions. This approach offers a high level of flexibility and control, allowing administrators to customize and adjust permissions granularly and according to the specific needs of the community and its members.


## Permissions Command

The **/permissions** command is reserved exclusively for roles that have the Administrator permission and allows adding or removing a specific permission (hash) from a role in the Discord server. It is important to note that the command itself does not have an associated [PERMISSION HASH](/docs/permissions); rather, it allows users with the appropriate privileges to manage [PERMISSION HASH](/docs/permissions)es for server roles. Only one hash can be entered via this command.

- [PERMISSION HASH](/docs/permissions): **permissions**


## Permission List Command

The **/permissionlist** command allows viewing the permissions (hashes) set for a specific role. This command provides a clear view of the permissions assigned to a role, facilitating more effective permission management.

- [PERMISSION HASH](/docs/permissions): **permissionlist**

## Premium Limitations

Users with a free plan can assign a maximum of 10 total permissions using the **/permissions** command.
