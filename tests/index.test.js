const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const webpack4 = require('webpack-v4');
const webpack5 = require('webpack-v5');

const VarLibraryAliasPlugin = require('../index');

jest.useFakeTimers();
jest.setTimeout(30000);
process.on('unhandledRejection', (r) => console.log(r));
process.traceDeprecation = true;

function testVarLibraryAliasPlugin(webpack, webpackConfig, expectedResult, expectedError, done) {
    webpack(webpackConfig, (err, stats) => {
        if (expectedError) {
            expect(stats.compilation.errors.join('\n')).toContain(expectedError);
        } else {
            expect(err).toBeFalsy();
        }

        if (expectedResult) {
            const fileName = Object.keys(stats.compilation.assets)[0];
            const filePath = path.resolve(stats.compilation.outputOptions.path, fileName);
            const builtCode = fs.readFileSync(filePath).toString();

            expect(builtCode).toMatch(expectedResult);
        }
        done();
    });
}

describe('VarLibraryAliasPlugin webpack 5 tests', () => {
    afterEach(() => {
        rimraf(path.resolve(__dirname, 'dist'), () => {});
    });

    it('adds an alias to the end without minimization', (done) => {
        testVarLibraryAliasPlugin(
            webpack5,
            {
                entry: path.resolve(__dirname, 'fixtures', 'index.js'),
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    publicPath: '/',
                    filename: 'myLib.js',
                    libraryTarget: 'var',
                    library: 'MyLib',
                },
                optimization: {
                    minimize: false,
                },
                plugins: [
                    new VarLibraryAliasPlugin({
                        alias: 'MyLibAlias',
                    }),
                ],
            },
            'var MyLibAlias=MyLib;',
            null,
            done
        );
    });

    it('adds an alias to the end with minimize', (done) => {
        testVarLibraryAliasPlugin(
            webpack5,
            {
                entry: path.resolve(__dirname, 'fixtures', 'index.js'),
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    publicPath: '/',
                    filename: 'myLib.js',
                    libraryTarget: 'var',
                    library: 'MyLib',
                },
                plugins: [
                    new VarLibraryAliasPlugin({
                        alias: 'MyLibAlias',
                    }),
                ],
            },
            'var MyLibAlias=MyLib;',
            null,
            done
        );
    });

    it('throws on non-library config', (done) => {
        testVarLibraryAliasPlugin(
            webpack5,
            {
                entry: path.resolve(__dirname, 'fixtures', 'index.js'),
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    publicPath: '/',
                    filename: 'myLib.js',
                },
                plugins: [
                    new VarLibraryAliasPlugin({
                        alias: 'MyLibAlias',
                    }),
                ],
            },
            null,
            'VarLibraryAliasWebpackPlugin: no output.library',
            done
        );
    });

    it('throws when no alias option provided', (done) => {
        testVarLibraryAliasPlugin(
            webpack5,
            {
                entry: path.resolve(__dirname, 'fixtures', 'index.js'),
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    publicPath: '/',
                    filename: 'myLib.js',
                },
                plugins: [new VarLibraryAliasPlugin()],
            },
            null,
            'VarLibraryAliasWebpackPlugin: invalid options',
            done
        );
    });
});

describe('VarLibraryAliasPlugin webpack 4 tests', () => {
    afterEach(() => {
        rimraf(path.resolve(__dirname, 'dist'), () => {});
    });

    it('adds an alias to the end without minimization', (done) => {
        testVarLibraryAliasPlugin(
            webpack4,
            {
                entry: path.resolve(__dirname, 'fixtures', 'index.js'),
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    publicPath: '/',
                    filename: 'myLib.js',
                    libraryTarget: 'var',
                    library: 'MyLib',
                },
                optimization: {
                    minimize: false,
                },
                plugins: [
                    new VarLibraryAliasPlugin({
                        alias: 'MyLibAlias',
                    }),
                ],
            },
            'var MyLibAlias=MyLib;',
            null,
            done
        );
    });

    it('adds an alias to the end with minimize', (done) => {
        testVarLibraryAliasPlugin(
            webpack4,
            {
                entry: path.resolve(__dirname, 'fixtures', 'index.js'),
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    publicPath: '/',
                    filename: 'myLib.js',
                    libraryTarget: 'var',
                    library: 'MyLib',
                },
                plugins: [
                    new VarLibraryAliasPlugin({
                        alias: 'MyLibAlias',
                    }),
                ],
            },
            'var MyLibAlias=MyLib;',
            null,
            done
        );
    });

    it('throws on non-library config', (done) => {
        testVarLibraryAliasPlugin(
            webpack4,
            {
                entry: path.resolve(__dirname, 'fixtures', 'index.js'),
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    publicPath: '/',
                    filename: 'myLib.js',
                },
                plugins: [
                    new VarLibraryAliasPlugin({
                        alias: 'MyLibAlias',
                    }),
                ],
            },
            null,
            'VarLibraryAliasWebpackPlugin: no output.library',
            done
        );
    });

    it('throws when no alias option provided', (done) => {
        testVarLibraryAliasPlugin(
            webpack4,
            {
                entry: path.resolve(__dirname, 'fixtures', 'index.js'),
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    publicPath: '/',
                    filename: 'myLib.js',
                },
                plugins: [new VarLibraryAliasPlugin()],
            },
            null,
            'VarLibraryAliasWebpackPlugin: invalid options',
            done
        );
    });
});
