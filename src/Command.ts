import { Command as BaseCommand, CommandoClient, CommandoMessage } from "discord.js-commando";
import CommandInfo from "./Types/CommandInfo";
import * as _ from 'lodash'
import { Message } from "discord.js";

export default abstract class Command extends BaseCommand {
    protected get purgeCommand() {
        return true;
    }

    protected constructor(client: CommandoClient, info: CommandInfo) {
        info = _.extend({
            argsPromptLimit: 0
        }, info);
        super(client, info);
    }

    async run(msg: CommandoMessage, args: object | string | string[]) {
        const response = this.handle(msg, args);
        if (this.purgeCommand) {
            await msg.delete();
        }
        return response;
    }

    protected abstract async handle(msg: CommandoMessage, args: object | string | string[]):  Promise<Message | Message[] | null> | null;
}