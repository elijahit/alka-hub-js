---
sidebar_position: 3
description: A versatile system for creating private or public voice channels with customizable naming conventions. Each category supports one configuration.
---
# Auto Voice System

## Introduction

The Auto Voice system is designed to be versatile, capable of accepting various values and configurations. It can generate private channels or channels accessible to everyone with different naming conventions. Each category can contain only one Auto Voice configuration to function properly.

Watch the preview of this autovoice system on YouTube now.
[Preview](https://www.youtube.com/embed/KELh-yd36NA)

## Auto Voice Command

The **/autovoice** command is used to configure the Auto Voice system. This command generates a setup channel that will be automatically deleted at the end of the configuration process. The provided instructions will be as follows: choose the method of channel creation, select whether the channels should be private or public, decide on the channel naming convention, and specify the message and dimensions (in the case of channels created through interaction).

- [PERMISSION HASH](/docs/permissions): **autovoice**

## Automatic Create

The "Automatic Create" option generates a voice channel that users can access to initiate the channel creation process. This process creates a channel and deletes it when at least one channel is empty and available. The voice channel will be deleted in any case if it remains empty for at least 3 seconds.

## Integration Create

The "Integration Create" option creates a text channel where an embedded message with a button acting as access to create the voice channel will be sent. The voice channel will be deleted in any case if it remains empty for at least 3 seconds.

## Premium Limitations

Users with a free plan can create a maximum of 1 category using the **/autovoice** command.