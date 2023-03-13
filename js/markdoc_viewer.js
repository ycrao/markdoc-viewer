function merge(obj) {
    var i = 1
    , target
    , key;
    for (; i < arguments.length; i++) {
    target = arguments[i];
        for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
            obj[key] = target[key];
            }
        }
    }
    return obj;
}
// using modern api
function request(key, defaultValue) {
    var params = new URLSearchParams(window.location.search)
    return params.has(key) ? params.get(key) : defaultValue
}

// using localStorage api
function config(name, defaultValue) {
    var cacheVal = defaultValue
    if (request(name) == undefined) {
      cacheVal = window.localStorage.getItem(name) ? window.localStorage.getItem(name) : defaultValue
    } else {
      window.localStorage.setItem(name, request(name))
      cacheVal = request(name)
    }
    return cacheVal
}

var MarkdocViewer = function(opt) {
    this.defaults = {
        'base_url': 'https://raw.githubusercontent.com/',
        'base_dir': '',
        'repo_name': 'yascmf/docs',
        'branch_name': 'master',
        'index_file': 'index.md',
        'home_file': 'README.md',
        'sider_id': 'sider-menu',
        'content_id': 'content',
    };
    this.options = merge(this.defaults, opt);
};

MarkdocViewer.prototype.marked = function () {
    var renderer = new marked.Renderer();
    renderer.table = function (header, body) {
        return '<table class="table table-bordered table-striped">\n'
                + '<thead>\n'
                + header
                + '</thead>\n'
                + '<tbody>\n'
                + body
                + '</tbody>\n'
                + '</table>\n';
    }
    marked.setOptions({
        renderer: renderer,
        gfm: true,
        // tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        langPrefix: 'language-',
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });
    return marked;
};

// using fetch api
MarkdocViewer.prototype.http_get = function (doc, success) {
    var base_dir = (this.options['base_dir'] === '') ? '' : (this.options['base_dir'] + '/');
    var _base = this.options['base_url'] + this.options['repo_name'] + '/' + this.options['branch_name'] + '/' + base_dir;
    var _url = _base + doc;
    fetch(_url).then(function (resp) {
        return resp.text(); 
    }).then(function (resText) {
        return success(resText);
    });
}

MarkdocViewer.prototype.viewer = function () {
    var content = this.options['content_id'];
    var sider = this.options['sider_id'];
    var marked = this.marked();
    var index = this.options['index_file'];
    var doc = request('doc');
    if (!doc) {
        doc = this.options['home_file'];
    }
    this.http_get(index, function (menuText) {
        var menuText = marked.parse(menuText);
        var pattern = new RegExp('href="([\\w_\\-\\/\\#\\.]+)"', 'gi');
        menuText = menuText.replace(pattern, 'href="?doc=$1"');
        //menu = menu.replace(/href="(\w+)\ + ext + .md"/gi, 'href="?doc=$1.md"');
        document.getElementById(sider).innerHTML = menuText;
    });

    this.http_get(doc, function (resText) {
        document.getElementById(content).innerHTML = marked.parse(resText);
    });
};
