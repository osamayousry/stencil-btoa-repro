import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'stencil-component',
  outputTargets: [
    reactOutputTarget({
      outDir: './src/react',
      hydrateModule: 'stencil-component/hydrate',
      clientModule: 'stencil-component/react/client',
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-hydrate-script',
      dir: './hydrate',
    },
    {
      type: 'dist-custom-elements',
      dir: 'components',
      generateTypeDeclarations: true,
      externalRuntime: false,
    },
    {
      type: 'www',
      serviceWorker: null,
    },
  ],
  testing: {
    browserHeadless: "shell",
  },
};
