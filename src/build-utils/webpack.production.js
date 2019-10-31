const webpack = require('webpack');
const pkg = require('../../package');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = () => ({

    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                            url: false,
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    'sass-loader',
                ]
            },
            {
                test: /\.(jpe?g|png|gif|ttf|eot|svg|woff)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.(ttf|eot|svg|woff)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            }
        ]
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),

        new FileManagerPlugin({
            onStart: {
                delete: ['./build']
            },

            onEnd: [
                {
                    copy: [
                        {source: './includes', destination: './build/includes'},
                        {source: './languages', destination: './build/languages'},
                        {source: './templates', destination: './build/templates'},
                        {source: './wp-radio-user-frontend.php', destination: './build/wp-radio-user-frontend.php'},
                        {source: './readme.txt', destination: './build/readme.txt'},
                        {
                            source: './src/vendor/select2/select2.min.css',
                            destination: './assets/css/select2.min.css'
                        },
                        {
                            source: './src/vendor/select2/select2.min.js',
                            destination: './assets/js/select2.min.js'
                        },
                        {source: './assets', destination: './build/assets'},
                    ]
                },
                {
                    archive: [
                        {source: './build', destination: `./build/${pkg.name}.zip`},
                    ]
                }
            ]
        })
    ]

});