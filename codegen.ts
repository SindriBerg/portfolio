import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  verbose: true,
  generates: {
    'src/gql/__generated__/rick-and-morty-graphql.ts': {
      schema: [
        'https://rickandmortyapi.com/graphql'
      ],
      documents: ['src/gql/queries/*.gql'],
      plugins: [
        {
          add: {
            content: '/* eslint-disable */',
          }
        },
        'typescript', 'typescript-operations', 'typed-document-node',
      ],
    },
  },
};

export default config;
