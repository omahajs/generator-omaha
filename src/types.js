/* @flow */
export type ProjectGenerator = {
    config: any,
    destinationPath: (path: string) => string,
    log: (message: string) => void,
    npmInstall: (dependencies?: Array<mixed>, options?: {save?: boolean, saveDev?: boolean}) => void,
    options: any,
    prompt: any,
    use: {
        benchmark?: boolean,
        coveralls?: boolean,
        jsinspect?: boolean,
        projectName: string,
        sourceDirectory: string
    }
};
export type WebappGenerator = {
    config: {
        getAll: void => any,
        get: (val: any) => any,
        set: (val: any) => any
    },
    destinationPath: (path: string) => string,
    npmInstall: (dependencies: string[], options?: {save?: boolean, saveDev?: boolean}) => void,
    options: any,
    use: {
        moduleData: string
    }
};
