const path = require('path');

const config = {  
    entry: {
        main : ['./src/sdk/index.js']
    },
    output: {
        path: path.resolve(__dirname, 'public', 'splitsdk'), 
        filename: 'splitsdk.js',
        library: 'Split',
        libraryTarget: 'umd',
        umdNamedDefine: true
    }
};

module.exports = config;
