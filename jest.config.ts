import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
};

export default config;
