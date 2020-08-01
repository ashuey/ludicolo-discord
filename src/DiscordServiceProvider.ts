import {CommandoClient} from "discord.js-commando"
import DatabaseSettingProvider from "./DatabaseSettingProvider";
import ServiceProvider from "@ashuey/ludicolo-framework/lib/Support/ServiceProvider";
import {config} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class DiscordServiceProvider extends ServiceProvider {
    register() {
        this.app.singleton('discord.client', async database_setting_provider => {
            const client = new CommandoClient({
                owner: config('discord.owner')
            });

            client.provider = database_setting_provider;
            await client.provider.init(client);
            client.on('commandError', (command, err) => console.log(err));
            return client;

        }, 'database_setting_provider');

        this.app.singleton('database_setting_provider', DatabaseSettingProvider, 'db');
    }
}