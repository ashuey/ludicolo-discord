import {CommandoClient} from "discord.js-commando";
import {default as KernelContract} from "./Contracts/Kernel"
import * as _ from "lodash";
import Application from "@ashuey/ludicolo-framework/lib/Contracts/Foundation/Application";
import Bootstrapper from "@ashuey/ludicolo-framework/lib/Contracts/Foundation/Bootstrapper";
import LoadEnvironmentVariables from "@ashuey/ludicolo-framework/lib/Foundation/Bootstrap/LoadEnvironmentVariables";
import LoadConfiguration from "@ashuey/ludicolo-framework/lib/Foundation/Bootstrap/LoadConfiguration";
import BootProviders from "@ashuey/ludicolo-framework/lib/Foundation/Bootstrap/BootProviders";
import RegisterProviders from "@ashuey/ludicolo-framework/lib/Foundation/Bootstrap/RegisterProviders";
import {config} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class Kernel implements KernelContract {
    protected app: Application;

    protected client: CommandoClient;

    protected commandsLoaded: boolean = false;

    protected bootstrappers_: (new (...any: any[]) => Bootstrapper)[] = [
        LoadEnvironmentVariables,
        LoadConfiguration,
        RegisterProviders,
        BootProviders
    ];

    constructor(app: Application) {
        this.app = app;
    }

    public async startListening(): Promise<void> {
        await this.client.login(config('discord.token'));
        console.log(`Connected to gateway. Online and listening in ${this.client.guilds.size} guilds`);
    }

    // noinspection JSMethodCanBeStatic
    protected groups(): string[][] {
        return [];
    }

    protected commands() {
        //
    }

    protected load(paths: string | string[]) {
        _(paths).castArray().forEach(path => {
            this.client.registry.registerCommandsIn(path)
        });
    }

    protected registerDefaults() {
        this.client.registry.registerDefaults();
    }

    public async bootstrap(): Promise<void> {
        if (!this.app.hasBeenBootstrapped()) {
            await this.app.bootstrapWith(this.bootstrappers());
        }

        this.client = await this.app.make('discord.client');

        if (!this.commandsLoaded) {
            this.client.registry.registerGroups(this.groups());
            this.commands();
            this.commandsLoaded = true;
        }
    }

    protected bootstrappers(): (new (...any: any[]) => Bootstrapper)[] {
        return this.bootstrappers_;
    }
}