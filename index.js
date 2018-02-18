const through2 = require('through2');

const Shopify = require('shopify-api-node');

module.exports = function(options){
    const API = new Shopify({
        shopName: options.shopName,
        apiKey: options.apiKey,
        password: options.password,
    });

    return {
        upload(){
            return through2.obj(function (file, enc, cb) {
                const self = this;

                const { Location } = file;

                API.scriptTag.create({
                    "event": "onload",
                    "src": Location,
                }).then(result => {
                    self.push(result);
                    cb();
                }).catch(err => {
                    cb(err);
                });
            });
        },
        remove() {
            return through2.obj(function(id, enc, cb){
                const self = this;

                API.scriptTag.delete(id)
                .then(result => {
                    self.push(result);
                    cb();
                }).catch(err => {
                    cb(err);
                });
            });
        }
    };
};
