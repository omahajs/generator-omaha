/* @flow */
type Config = {
    isNative: boolean,
    isWebapp: boolean,
    pluginDirectory: string,
    projectParameters: Object,
    sourceDirectory: string,
    userName: string,
    useAmd: boolean,
    useAria: boolean,
    useBenchmark: boolean,
    useBrowserify: boolean,
    useCoveralls: boolean,
    useHandlebars: boolean,
    useImagemin: boolean,
    useJest: boolean,
    useJsinspect: boolean,
    useLess: boolean,
    useSass: boolean,
    useWebpack: boolean
};
type GeneratorConfig = {
    getAll: () => Config,
    get: (val: string) => Object | string | boolean,
    set: (name: mixed, val?: mixed) => void
};
export type ProjectGenerator = {
    config: GeneratorConfig,
    destinationPath: (path: string) => string,
    log: (message: string) => void,
    npmInstall: (dependencies?: Array<mixed>, options?: {save?: boolean, saveDev?: boolean}) => void,
    options: {
        defaults: boolean,
        skipBenchmark: boolean,
        skipCoveralls: boolean,
        skipJsinspect: boolean,
        useBrowserify: boolean,
        useJest: boolean,
        useWebpack: boolean
    },
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
    options: {
        useBrowserify: boolean,
        useJest: boolean,
        useWebpack: boolean
    },
    use: {
        moduleData: string
    }
};
export type ServerGenerator = {
    datasources: Object,
    enableGraphiql: boolean,
    graphqlPort: string,
    httpPort: string,
    httpsPort: string,
    markdownSupport: boolean,
    options: {
        defaults: boolean,
        http: string,
        https: string,
        graphql: string,
        ws: string
    },
    prompt: Function,
    useJest?: boolean,
    websocketPort: string
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
        underscore?: boolean,
        marionette?: boolean
    },
    user: {
        git: {
            name: Function
        }
    },
    userName: string
};
