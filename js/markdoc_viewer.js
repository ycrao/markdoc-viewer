// merge object, like es `{ ...a, b}`
function merge(obj) {
  let i = 1,
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
  const params = new URLSearchParams(window.location.search);
  return params.has(key) ? params.get(key) : defaultValue;
}
// using sessionStorage api
function config(name, defaultValue) {
  let cacheVal = defaultValue;
  if (request(name) == undefined) {
    cacheVal = window.sessionStorage.getItem(name)
      ? window.sessionStorage.getItem(name)
      : defaultValue;
  } else {
    window.sessionStorage.setItem(name, request(name));
    cacheVal = request(name);
  }
  return cacheVal;
}
// get directory url from a full url
function getDirectoryUrl(url) {
  try {
    const u = new URL(url);
    u.pathname = u.pathname.split('/').slice(0, -1).join('/') + '/';
    if (u.pathname === '/') u.pathname = '/';
    return u.toString();
  } catch (e) {
    const i = url.lastIndexOf('/');
    return i === -1 ? '' : url.substring(0, i + 1);
  }
}

// 使用ES6 Class语法定义MarkdocViewer
class MarkdocViewer {
  constructor(opt) {
    this.defaults = {
      base_url: "https://raw.githubusercontent.com/",
      base_dir: "",
      repo_name: "ycrao/mynotes",
      branch_name: "master",
      index_file: "index.md",
      home_file: "intro.md",
      sider_id: "sider-menu",
      content_id: "content"
    };
    this.options = merge(this.defaults, opt);
    this.baseDirUrl = '';
  }

  // config marked options
  marked() {
    // 使用 marked-highlight 插件集成 highlight.js
    const markedHighlight = window.markedHighlight;

    // 创建自定义的 marked 实例
    const markedInstance = new marked.Marked(
      markedHighlight.markedHighlight({
        langPrefix: 'language-',
        highlight: function (code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          try {
            return hljs.highlight(code, { language }).value;
          } catch (__) {
            return hljs.highlightAuto(code).value;
          }
        }
      })
    );

    // 自定义 renderer
    const renderer = new marked.Renderer();
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

    // 设置选项
    markedInstance.setOptions({
      renderer: renderer,
      gfm: true,
      breaks: false,
      pedantic: false,
      smartLists: true,
      smartypants: false,
    });

    return markedInstance;
  }

  // 显示/隐藏加载指示器
  showLoading(show) {
    const loadingEl = document.getElementById('loadingIndicator');
    const contentEl = document.getElementById(this.options["content_id"]);
    if (loadingEl && contentEl) {
      loadingEl.style.display = show ? 'block' : 'none';
      contentEl.style.display = show ? 'none' : 'block';
    }
  }

  // using fetch api with error handling
  http_get(doc, success, error) {
    const base_dir =
      this.options["base_dir"] === "" ? "" : this.options["base_dir"] + "/";
    const _base =
      this.options["base_url"] +
      this.options["repo_name"] +
      "/" +
      this.options["branch_name"] +
      "/" +
      base_dir;
    const _url = _base + doc;
    this.baseDirUrl = getDirectoryUrl(_url);

    return fetch(_url)
      .then(function (resp) {
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        return resp.text();
      })
      .then(function (resText) {
        return success(resText, _url);
      })
      .catch(function (err) {
        console.error('Error fetching document:', err);
        if (error) error(err);
      });
  }

  // render
  viewer() {
    const contentId = this.options["content_id"];
    const siderId = this.options["sider_id"];
    const marked = this.marked();
    const indexFile = this.options["index_file"];
    let docFile = request("doc");
    if (!docFile) {
      docFile = this.options["home_file"];
    }

    // 显示加载指示器
    this.showLoading(true);

    // get index file to generate menu
    this.http_get(indexFile, function (menuText) {
      var menuText = marked.parse(menuText);
      // 修复正则表达式 - 移除不必要的转义
      var pattern = new RegExp('href="([\\w_\\-/#.]+)"', "gi");
      menuText = menuText.replace(pattern, 'href="?doc=$1"');
      document.getElementById(siderId).innerHTML = menuText;
    }, function(error) {
      console.error('Failed to load menu:', error);
    });

    // render document
    var self = this;
    this.http_get(docFile, function (resText) {
      // do some fliter
      let rendererHtml = marked.parse(resText);
      document.getElementById(contentId).innerHTML = rendererHtml;
      // 隐藏加载指示器
      self.showLoading(false);

      // 高亮当前菜单项
      setTimeout(function () {
        var href = "?doc=" + request("doc");
        var targetLi = document.querySelector(
          "#" + siderId + ' li a[href="' + href + '"]'
        );
        if (targetLi != null && targetLi.parentElement != null) {
          targetLi.parentElement.setAttribute("class", "active");
        }
      }, 100);

    }, function (error) {
      // 错误处理
      document.getElementById(contentId).innerHTML = `
        <div class="error-message" style="padding: 20px; text-align: center; color: #d32f2f;">
          <h3>加载文档失败</h3>
          <p>${error.message || '无法加载文档内容'}</p>
        </div>
      `;
      self.showLoading(false);
    });
  }
}