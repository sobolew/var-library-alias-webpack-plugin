class VarLibraryAliasWebpackPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        const self = this;

        compiler.hooks.emit.tapPromise('VarLibraryAliasWebpackPlugin', (compilation) => {
            return new Promise((resolve, reject) => {
                try {
                    const webpackVersion = defineWebpackVersion(compiler);

                    validateOptions(self.options);
                    validateConfig(compiler.options.output, webpackVersion);

                    if (webpackVersion < 4 && webpackVersion > 5) {
                        error('unsupported webpack version');
                    }

                    const alias = self.options.alias;
                    const libName = getLibraryName(compiler.options.output, webpackVersion);

                    compilation.chunks.forEach((chunk) => {
                        chunk.files.forEach((filename) => {
                            if (webpackVersion === 4) {
                                const source = compilation.assets[filename].source();

                                compilation.assets[filename].source = () =>
                                    `${source}var ${alias}=${libName};`;
                            } else {
                                let key = '_value';
                                if (!compiler.options.optimization.minimize) {
                                    key = '_cachedSource';
                                }

                                const source = compilation.assets[filename][key];

                                compilation.assets[filename][
                                    key
                                ] = `${source}var ${alias}=${libName};`;
                            }
                        });
                    });

                    resolve();
                } catch (e) {
                    compilation.errors.push(e);
                    resolve();
                }
            });
        });
    }
}

function validateConfig(output, version) {
    if (!output.library) {
        error('no output.library');
    }

    if (version === 5) {
        if (output.library.type !== 'var') {
            error('output.libraryTarget should be var');
        }
    } else {
        if (output.libraryTarget !== 'var') {
            error('output.libraryTarget should be var');
        }
    }
}

function validateOptions(options) {
    if (
        !options ||
        typeof options !== 'object' ||
        !options.alias ||
        typeof options.alias !== 'string'
    ) {
        error('invalid options');
    }
}

function defineWebpackVersion(compiler) {
    return compiler.webpack && compiler.webpack.version
        ? getMajorVersion(compiler.webpack.version)
        : 4;
}

function getMajorVersion(semver) {
    return Number(semver.split('.')[0]);
}

function error(text) {
    throw new Error(`VarLibraryAliasWebpackPlugin: ${text}`);
}

function getLibraryName(output, version) {
    if (version === 5) {
        return output.library.name;
    }

    return output.library;
}

module.exports = VarLibraryAliasWebpackPlugin;
