// 拡張機能インストール時に呼び出されるコールバック関数を追加する
chrome.runtime.onInstalled.addListener(function() {

	// 何かを選択している場合は「サンプルメニュー:子1」という項目を
	// 「サンプルメニュー：ルート」の子アイテムとして表示する
	chrome.contextMenus.create({
		"title": "画像要素を削除する",
		"contexts":["image"],
		"id": "delElement"
	});

  	chrome.contextMenus.create({
		"title": "リンクを開く",
		"contexts":["link"],
		"id": "openLink"
	});

});


function onClickHandler(info, tab) {
  switch (info.menuItemId)
  {
  case "delElement":
    if (info.mediaType)
    {
      /* 画像リンクを取り除く */
      chrome.tabs.executeScript(
        tab.id,
        {
          /* frameIdを設定しているのはスクリプトコードをそのフレーム対して
             挿入して実行するため。
             この結果、直接iframe要素に対して動作させることができる。
          */
          frameId: info.frameId,
          matchAboutBlank: true,
          code:
          'function removeElement(elm) {\n' +
          '  if (elm.parentNode.tagName.toLowerCase() == "span" || \n' +
          '      elm.parentNode.tagName.toLowerCase() == "div"  || \n' +
          '      elm.parentNode.tagName.toLowerCase() == "html") {\n' +
          '    console.log(elm.parentNode);\n' +
          '    elm.parentNode.remove();\n' +
          '  } else {\n' +
          '    removeElement(elm.parentNode);\n' +
          '  }\n' +
          '}\n' +
          'console.log("' + info.srcUrl + '");\n' +
          'var url = "' + info.srcUrl + '";\n' +
          'var arry = document.getElementsByTagName("img");\n' +
          'for (var i = 0; i < arry.length; i++) {\n' +
          '  if ( arry[i].src == url ) {\n' +
          '    removeElement(arry[i]);\n' +
          '    console.log(url);\n' +
          '  }\n' +
          '}\n'
        }
      );
    }
	break;

  case "openLink":
    /* 同一タブでリンクを開く */
    //mycallback(info, tab);
    if (info.linkUrl)
    {
      chrome.tabs.update(tab.id, {url: info.linkUrl});
    }
    break;
    
  default:
    break;
  }
  console.log(tab);
  console.log(info);
}

// コンテキストメニューをクリックしたときに呼び出されるコールバック関数を追加する
chrome.contextMenus.onClicked.addListener(onClickHandler);

/*
function mycallback(info, tab) {
  chrome.tabs.sendMessage(tab.id, "getClickedEl",
                          function(clickedEl) {
                            console.log(clickedEl);
                            console.log(clickedEl.value);
                          });
}*/

