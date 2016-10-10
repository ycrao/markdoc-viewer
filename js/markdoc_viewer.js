    if (!window.localStorage) {
      window.localStorage = {
        getItem: function (sKey) {
          if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
          return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
        },
        key: function (nKeyId) {
          return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
        },
        setItem: function (sKey, sValue) {
          if(!sKey) { return; }
          document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
          this.length = document.cookie.match(/\=/g).length;
        },
        length: 0,
        removeItem: function (sKey) {
          if (!sKey || !this.hasOwnProperty(sKey)) { return; }
          document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          this.length--;
        },
        hasOwnProperty: function (sKey) {
          return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        }
      };
      window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
    }


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

    function request(key, val) {
        var val = (arguments[1] === undefined) ? null : arguments[1];
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == key) {
                return pair[1];
            }
        }
        if ((typeof val == 'string') && (val.constructor == String)) {
            return (val === '') ? (false) : val;
        } else {
            return (false);
        }
    }

    function config(name, def) {
        var def = (arguments[1] === undefined) ? null : arguments[1];
        if (request(name) === false) {
            var req_name = localStorage.getItem(name) ? localStorage.getItem(name) : def;
        } else {
            localStorage.setItem(name, request(name));
            var req_name = request(name);
        }
        return req_name;
    }

    var MarkdocViewer = function(opt) {
        this.defaults = {
            'base_url': 'https://raw.githubusercontent.com/',
            'base_dir': '',
            'repo_name': 'yascmf/docs',
            'branch_name': 'master',
            'index_file': 'index.md',
            'home_file': 'readme.md',
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
            tables: true,
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

    MarkdocViewer.prototype.http_get = function (doc, success, failed) {
        var xmlHttp = null;
        var base_dir = (this.options['base_dir'] === '') ? '' : (this.options['base_dir'] + '/');
        var _base = this.options['base_url'] + this.options['repo_name'] + '/' + this.options['branch_name'] + '/' + base_dir;
        var _url = _base + doc;
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();  //FireFox、Opera等浏览器支持的创建方式
        } else {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  //IE浏览器支持的创建方式 
        }
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                success(xmlHttp.responseText);
            } else {
                if(failed){
                    failed(xmlHttp.status);
                }
            }
        }
        xmlHttp.open("GET", _url, true);
        xmlHttp.send(null);
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
        this.http_get(index, function (menu) {
            var menu = marked(menu);
            var pattern = new RegExp('href="([\\w_\\-\\/\\#\\.]+)"', 'gi');
            menu = menu.replace(pattern, 'href="?doc=$1"');
            //menu = menu.replace(/href="(\w+)\ + ext + .md"/gi, 'href="?doc=$1.md"');
            document.getElementById(sider).innerHTML = menu;
        });

        this.http_get(doc, function (res) {
            document.getElementById(content).innerHTML = marked(res);
        });
    };
