---
sidebar_position: 2
description: The Alka Network ticket system allows creating various types of tickets with multiple subtypes, distinguishable by prefixes. This flexibility ensures a personalized and optimized experience for handling community requests and issues.
---

# Ticket System

## Introduction

The ticket system of Alka Network has been designed following a precise logic: DYNAMISM. Thanks to this highly complex system, it will be possible to create various types of tickets, each of which may contain multiple subtypes of tickets. These will be distinguishable to users through prefixes applied to the components (buttons that allow users to open a ticket) inserted after the initialization of the ticket system in the selected message. This flexibility allows administrators to configure tickets according to the specific needs of the community, ensuring a personalized and optimized experience to handle a wide range of requests and issues.

Watch the preview of this autorole system on YouTube now.
[Preview](https://www.youtube.com/embed/lOv8oAU-KfE)


## Ticket Command

The **/ticket** command initiates the initial configuration for the ticket message. This message will allow users to submit requests via the ticket components. The command creates a configuration channel and guides you through the various settings.

**#1 Enter a title:** This title will have no significance for now, but it may be useful for any future functionalities.

**#2 Enter a description:** This description will be the content of the sent message, and we recommend paying attention to its content.

**#3 In the configuration channel:**

- Select a channel for the tickets: This is the channel where the message will be sent and where it will be created as the ticket message.
- Select a category: This category will be where the tickets are opened. We recommend setting permissions so that only administrators can see the ticket channels and preventing users from sending messages in the everyone role, so no administrator can write before the ticket is assigned. Tickets inherit permissions from the categories (Users can still write before the ticket is opened).
- Select the channel for transcripts: This channel will receive transcripts of resolved tickets.

- [PERMISSION HASH](/docs/permissions): **ticket**


## Ticket Components Command

The **/ticketcomponents** command allows you to add various components to the ticket message. This command allows the insertion of a maximum of 5 (five) components per message, each of which must have a unique prefix. The prefix can be a string of up to 3 characters or an emoji icon and will be set at the beginning of the name in the created ticket channel. The command requires the following values:

- **message:** The message ID (developer mode must be active).
- **prefix:** The prefix of the component, which must be unique and non-repeating. It can contain a string of up to 3 characters or an emoji icon (NO CUSTOM).
- **label:** The name that will appear on the configured button in the ticket message.
- **style:** The style the button should have. A list of styles is provided below via a screenshot.
- **emoji (optional):** The emoji that will be inserted into the button before the label. It can contain custom emojis as long as they are from the same server.

<div class="centered-image">
  <img src="/img/ticketcomponents.png" alt="Ticket Components"/>
</div>

- [PERMISSION HASH](/docs/permissions): **ticket**


## TIPS & TRICKS

:::tip TIPS & TRICKS

- Create various categories and customize them, for example: (Support, Administrative, Partnership, etc...) The possibilities are endless.
- Set permissions for each category so that the "everyone" role cannot send messages or view the channels of the category. Make sure to add the roles of the administrators who need to manage the tickets (Tickets inherit permissions from the categories).
- Use different transcription channels and mark them with an emoji or a unique identifier (during configuration, it is not easy to verify which channel is associated with which purpose if they have the same name).

:::

## Premium Limitations

This feature does not have any premium limitations.