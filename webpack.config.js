module.exports = {
    entry: ['./index.js'],
    output:{
        filename:'app.min.js',
    },
    mode:'development',
    devServer:{
        port:3000
    },
    module:{
        rules:[
            {
                use: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                use: ['glslify-import-loader','raw-loader','glslify-loader'],
                test: /\.(glb|gltf|vert|frag|glsl)$/
            }
        ]
    }
};