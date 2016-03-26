var requireJsConfig = {
    baseUrl: "../static/js",
    paths: {
        ltpl: '../../public/requirejs/ltpl',
        lcss: '../../public/requirejs/lcss',
        angular: browser.ieVersion<=8 ? '../../public/angular/ie78' : '../../public/angular',
        tpl: '../tpl',
        public: "../../public",
        bin:"../../php/bin"
    }
}
