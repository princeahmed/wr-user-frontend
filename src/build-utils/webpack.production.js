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
                        {source: './wp-portfolio-showcase.php', destination: './build/wp-portfolio-showcase.php'},
                        {source: './uninstall.php', destination: './build/uninstall.php'},
                        {source: './readme.txt', destination: './build/readme.txt'},
                        {
                            source: './src/vendor/popup/magnific-popup.css',
                            destination: './assets/css/magnific-popup.css'
                        },
                        {
                            source: './src/vendor/popup/jquery.magnific-popup.min.js',
                            destination: './assets/js/jquery.magnific-popup.min.js'
                        },
                        {
                            source: './src/vendor/responsiveslides/responsiveslides.min.js',
                            destination: './assets/js/responsiveslides.min.js'
                        },
                        {
                            source: './src/vendor/responsiveslides/responsiveslides.css',
                            destination: './assets/css/responsiveslides.css'
                        },
                        {
                            source: './src/vendor/isotope.pkgd.min.js',
                            destination: './assets/js/isotope.pkgd.min.js'
                        },
                        {source: './assets', destination: './build/assets'}
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