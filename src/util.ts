import {CategoryChannel, Channel, TextChannel} from "discord.js";

export function isTextChannel(channel: Channel): channel is TextChannel {
    return channel.type === "text";
}

export function isCategoryChannel(channel: Channel): channel is CategoryChannel {
    return channel.type === "category";
}