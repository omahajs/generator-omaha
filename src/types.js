/* @flow */
type GeneratorConfig = {
    getAll: void => any,
    get: (val: any) => any,
    set: (val: any) => any
};
export type ProjectGenerator = {
    config: GeneratorConfig,
    destinationPath: (path: string) => string,
    log: (message: string) => void,
    npmInstall: (dependencies?: Array<mixed>, options?: {save?: boolean, saveDev?: boolean}) => void,
    options: any,
    prompt: Function,
    use: {
        benchmark?: boolean,
        coveralls?: boolean,
        jsinspect?: boolean,
        projectName: string,
        sourceDirectory: string
    }
};
export type WebappGenerator = {
    config: GeneratorConfig,
    destinationPath: (path: string) => string,
    npmInstall: (dependencies: string[], options?: {save?: boolean, saveDev?: boolean}) => void,
    options: any,
    use: {
        moduleData: string
    }
};
export type ServerGenerator = {
    prompt: Function,
    options: any,
    datasources: any,
    httpPort: string,
    httpsPort: string,
    websocketPort: string,
    graphqlPort: string,
    markdownSupport: boolean,
    useJest?: boolean
};
export type PluginGenerator = {
    async: Function,
    config: GeneratorConfig,
    defineArguments: string,
    dependencies: string[],
    depList: string[],
    iifeArguments: string,
    options: {
        alias: string,
        customDependency: string,
        name: string
    },
    pluginName: string,
    prompt: Function,
    requireStatements: string,
    use: {
        backbone?: boolean,
        underscore?: boolean
    },
    user: {
        git: {
            name: Function
        }
    },
    userName: string
};
