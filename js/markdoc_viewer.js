// merge object, like es `{ ...a, b}`
function merge(obj) {
  var i = 1,
    target,
    key;
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
  var params = new URLSearchParams(window.location.search);
  return params.has(key) ? params.get(key) : defaultValue;
}
// using localStorage api
function config(name, defaultValue) {
  var cacheVal = defaultValue;
  if (request(name) == undefined) {
    cacheVal = window.localStorage.getItem(name)
      ? window.localStorage.getItem(name)
      : defaultValue;
  } else {
    window.localStorage.setItem(name, request(name));
    cacheVal = request(name);
  }
  return cacheVal;
}
// init options
var MarkdocViewer = function (opt) {
  this.defaults = {
    base_url: "https://raw.githubusercontent.com/",
    base_dir: "",
    repo_name: "yascmf/docs",
    branch_name: "master",
    index_file: "index.md",
    home_file: "README.md",
    sider_id: "sider-menu",
    content_id: "content",
  };
  this.options = merge(this.defaults, opt);
};
// config marked options
MarkdocViewer.prototype.marked = function () {
  var renderer = new marked.Renderer();
  renderer.table = function (header, body) {
    return (
      '<table class="table table-bordered table-striped">\n' +
      "<thead>\n" +
      header +
      "</thead>\n" +
      "<tbody>\n" +
      body +
      "</tbody>\n" +
      "</table>\n"
    );
  };
  // see: https://marked.js.org/using_advanced#options
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    // sanitize: false, // deprecated
    smartLists: true,
    smartypants: false,
    langPrefix: "language-",
    // need highlight.js
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    },
  });
  return marked;
};
// using fetch api
MarkdocViewer.prototype.http_get = function (doc, success) {
  var base_dir =
    this.options["base_dir"] === "" ? "" : this.options["base_dir"] + "/";
  var _base =
    this.options["base_url"] +
    this.options["repo_name"] +
    "/" +
    this.options["branch_name"] +
    "/" +
    base_dir;
  var _url = _base + doc;
  fetch(_url)
    .then(function (resp) {
      return resp.text();
    })
    .then(function (resText) {
      return success(resText);
    });
};
// render
MarkdocViewer.prototype.viewer = function () {
  var contentId = this.options["content_id"];
  var siderId = this.options["sider_id"];
  var marked = this.marked();
  var indexFile = this.options["index_file"];
  var docFile = request("doc");
  if (!docFile) {
    docFile = this.options["home_file"];
  }
  // get index file to generate menu
  this.http_get(indexFile, function (menuText) {
    var menuText = marked.parse(menuText);
    var pattern = new RegExp('href="([\\w_\\-\\/\\#\\.]+)"', "gi");
    menuText = menuText.replace(pattern, 'href="?doc=$1"');
    // menuText = menuText.replace(/href="(\w+)\ + ext + .md"/gi, 'href="?doc=$1.md"');
    document.getElementById(siderId).innerHTML = menuText;
  });
  // render document
  this.http_get(docFile, function (resText) {
    // do some fliter
    // such as: DOMPurify <https://github.com/cure53/DOMPurify>
    document.getElementById(contentId).innerHTML = marked.parse(resText);
  });
};
