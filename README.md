# MarkdocViewer

> `MarkdocViewer` : reading markdown documentation from open git repository (just in one page) !

> `MarkdocViewer` ：从公开的 `git` 仓库阅读 `markdown` 文档 （就一个页面）！

## 参数配置

`MarkdocViewer` 默认配置如下：

```javascript
// default options
{
    // git repo raw file base_url, default to github
    'base_url': 'https://raw.githubusercontent.com/',
    // document directory, default empty
    'base_dir': '',
    // git repo name, default 'yascmf/docs'
    'repo_name': 'ycrao/mynotes',
    // git branch name, default 'master'
    'branch_name': 'master',
    // index file name, using it to generate sider -nav menu
    'index_file': 'index.md',
    // home file name, default 'README.md'
    'home_file': 'intro.md',
    // element id for left-sider or right-sider menu in HTML
    'sider_id': 'sider-menu',
    // element id for main content in HTML
    'content_id': 'content',
}
```

以上某些配置，可以通过传入查询串，予以重载新配置：

`hhttps://raoyc.com/markdoc-viewer?doc=intro.md&dir=&index=index.md&repo=ycrao/mynotes&home=intro.md&branch=master`

其中，`dir` 查询串对应 `base_dir` 、`repo` 对应 `repo_name` 配置，后面依次类推。请保证，查询串值与仓库文档实际结构目录一致。

```javascript
var dir = config('dir', ''),
    repo = config('repo', 'ycrao/mynotes'),
    branch = config('branch', 'master'),
    index = config('index', 'index.md'),
    home = config('home', 'intro.md');
var config = {
    'base_url': 'https://raw.githubusercontent.com/',
    'base_dir': dir,
    'repo_name': repo,
    'branch_name': branch,
    'index_file': index,
    'home_file': home,
    'sider_id': 'sider-menu',
    'content_id': 'content',
};
console.log(config);
var mv = new MarkdocViewer(config);
mv.viewer();
```

## 在线文档阅读示例

* [my-notes](https://github.com/ycrao/mynotes)：[online link](https://raoyc.com/markdoc-viewer?doc=README.md&dir=&index=index.md&repo=ycrao/mynotes&home=README.md&branch=master)
* 

## 鸣谢

本源码使用到以下开源组件：

- [`marked`](https://github.com/chjj/marked)
- [`github-markdown-css`](https://github.com/sindresorhus/github-markdown-css)
- [`highlight.js`](https://highlightjs.org/)
- [`bootstrap`](http://getbootstrap.com/)
- 感谢 [GitHub](https://github.com) 提供项目文档托管服务。
