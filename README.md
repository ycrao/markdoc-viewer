# MarkdocViewer

> MarkdocViewer : reading markdown documentation from open git repository (just in one page) !

> MarkdocViewer ：从公开的 `git` 仓库阅读 `markdown` 文档 （就一个页面）！


## 参数配置

MarkdocViewer默认配置如下：

```javascript
    this.defaults = {
            'base_url': 'https://raw.githubusercontent.com/',  //git 公共仓库 raw 基地址
            'base_dir': '',  //文档所在子目录，默认为空
            'repo_name': 'yascmf/docs',  //文档仓库名，默认为作者的 YASCMF 文档库
            'branch_name': 'master',  //文档所在分支，默认为master
            'index_file': 'index.md',  //目录索引文件，默认为index.md
            'home_file': 'readme.md',  //目录默认主页文件，默认为readme.md
            'sider_id': 'sider-menu',  //导航目录所在div的id名
            'content_id': 'content',  //markdown正文所在div的id名
        };
```

以上某些配置，可以通过传入查询串，予以重载新配置：

`https://raoyc.com/markdoc-viewer?dir=&repo=yascmf/docs&branch=master&index=index.md&home=readme.md`

其中，`dir` 查询串对应 `base_dir` 、`repo` 对应 `repo_name` 配置，后面依次类推。请保证，查询串值与仓库文档实际结构目录一致。

```javascript
    var dir = config('dir', ''),
        repo = config('repo', 'yascmf/docs'),
        branch = config('branch', 'master'),
        index = config('index', 'index.md'),
        home = config('home', 'readme.md');
    var config = {
        //default git raw base url : https://raw.githubusercontent.com/
        'base_url': 'https://raw.githubusercontent.com/',
        'base_dir': dir,
        'repo_name': repo,
        //default branch name : master
        'branch_name': branch,
        'index_file': index,
        'home_file': home,
        //sider menu div id
        'sider_id': 'sider-menu',
        //markdown content div id
        'content_id': 'content',
    };
    console.log(config);
    var mv = new MarkdocViewer(config);
    mv.viewer();
```

## 在线文档阅读示例

*   [`YASCMF` 文档](https://github.com/yascmf/docs)：

https://raoyc.com/markdoc-viewer?doc=readme.md&dir=&index=index.md&repo=yascmf/docs&home=readme.md


*   [`GitBookIO` 文档](https://github.com/GitbookIO/gitbook/tree/master/docs)：

https://raoyc.com/markdoc-viewer?doc=README.md&dir=docs&index=SUMMARY.md&repo=GitbookIO/gitbook&home=README.md


## 鸣谢

本源码使用到以下开源组件：

- [`marked`](https://github.com/chjj/marked)

- [`github-markdown-css`](https://github.com/sindresorhus/github-markdown-css)

- [`highlight.js`](https://highlightjs.org/)

- [`bootstrap`](http://getbootstrap.com/)

- 感谢 [GitHub](https://github.com) 提供项目文档托管服务。