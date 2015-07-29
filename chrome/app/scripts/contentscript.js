'use strict';

var getLinks = function() {
  var header, tag, headerLevelStr, depth;
  var headers = document.querySelectorAll('article.markdown-body h1, article.markdown-body h2, article.markdown-body h3, article.markdown-body h4, article.markdown-body h5, article.markdown-body h6');
  var links = [];

  for (var i = 0; i < headers.length; ++i) {
    header = headers[i];
    tag = header.tagName;
    headerLevelStr = tag.substring(1);
    depth = Number.parseInt(headerLevelStr);

    links.push({
      text: header.innerText,
      hash: header.children[0].hash,
      depth: depth
    });
  }

  return links;
};

var openList = function(depth) {
  var html = '';

  while (depth--) {
    html += '<li style="list-style:none;"><ul>';
  }

  return html;
};

var closeList = function(depth) {
  var html = '';

  while (depth--) {
    html += '</ul></li>';
  }

  return html;
};

var buildContents = function(links) {
  var node;
  var contents = '<ul>';
  var currentDepth = 1;

  for (var i = 0; i < links.length; ++i) {
    node = links[i];

    if (node.depth > currentDepth) {
      contents += openList(node.depth - currentDepth);
    } else if (node.depth < currentDepth) {
      contents += closeList(currentDepth - node.depth);
    }

    currentDepth = node.depth;

    contents += '<li><a href="' + node.hash + '">' + node.text + '</a></li>';
  }

  contents += closeList(--currentDepth);
  contents += '</ul>';

  return contents;
};

var insertContents = function(contents) {
  var readmeTarget = document.querySelectorAll('#readme > h3')[0];

  if (!readmeTarget) {
    return false;
  }

  var oldLink = document.querySelectorAll('.github-markdown-contents')[0];

  if (oldLink) {
    oldLink.parentNode.removeChild(oldLink);
  }

  var sidebarTarget = document.querySelectorAll('.repository-sidebar')[0];

  var link = '<nav class="sunken-menu github-markdown-contents" role="navigation"><ul class="sunken-menu-group"><li class="tooltipped"><a href="#" class="selected sunken-menu-item"><span class="octicon octicon-list-unordered"></span> <span class="full-word">Menu</span></a></li><li class="tooltipped tooltipped-w" aria-label="Pull requests"><nav id="github-markdown-contents-container" role="navigation">' + contents + '</nav></li></ul></nav>';

  sidebarTarget.innerHTML += link;
};

var links = getLinks();

if (links.length) {
  var contents = buildContents(links);
  insertContents(contents);
}
