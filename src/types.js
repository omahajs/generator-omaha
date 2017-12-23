/* @flow */
export type ProjectGenerator = {
  config: any,
  destinationPath: (path: string) => string,
  log: (message: string) => void,
  npmInstall: (dependencies?: Array<mixed>, options?: {save?: boolean, saveDev?: boolean}) => void,
  options: any,
  projectName: string,
  prompt: any,
  sourceDirectory: string,
  use: {
      benchmark?: boolean,
      coveralls?: boolean,
      jsinspect?: boolean,
      projectName: string,
      sourceDirectory: string
  },
  useBenchmark: boolean,
  useCoveralls: boolean,
  useJest: boolean,
  useJsinspect: boolean
};
export type WebappGenerator = {
    config: any,
    destinationPath: (path: string) => string,
    npmInstall: (dependencies: string[], options?: {save?: boolean, saveDev?: boolean}) => void,
    sourceDirectory: string,
    isNative?: boolean,
    useAmd?: boolean,
    useAria?: boolean,
    useBrowserify?: boolean,
    useHandlebars?: boolean,
    useImagemin?: boolean,
    useJest?: boolean,
    useLess?: boolean,
    useSass?: boolean
};
