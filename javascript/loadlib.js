(function () {

var dynamicLoading = {
    css: function (path) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.href = path;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      head.appendChild(link);
    },
    js: function (path, callback, onFailed) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.src = path;
      script.type = 'text/javascript';
      script.async = false;
      script.onload = script.onreadystatechange = function () {
        if (!script.readyState || script.readyState === "loaded" || script.readyState === "complete") {
          script.onload = script.onreadystatechange = null;
          callback && callback();
        }
      };
      if (onFailed && typeof onFailed === "function") {
        script.onerror = onFailed;
      }
      head.appendChild(script);
    },
    type: 't2025060422',
    time: '1723600210'
  };

// Load base dependencies
dynamicLoading.js('javascript/deString.js');
dynamicLoading.js('javascript/jquery-3.5.1.min.js');
dynamicLoading.css('style/style.css');

 var pageEditorJs = 'javascript/search.js';
 
  //dynamicLoading.js('javascript/book.js');
dynamicLoading.js('javascript/book.js', function () {
  console.log("📘 book.js loaded");

  // Fix bookConfig
  window.bookConfig = window.bookConfig || {};
  bookConfig.totalPageCount = 17;

  // ✅ Watch for changes to BookInfo.currentPageIndex
  if (window.BookInfo) {
    try {
      let lastIndex = BookInfo.currentPageIndex;
      Object.defineProperty(BookInfo, "currentPageIndex", {
        get() {
          return this._currentPageIndex || lastIndex;
        },
        set(val) {
          this._currentPageIndex = val;
          lastIndex = val;
          console.log("📘 currentPageIndex changed to:", val);

          const el = document.querySelector("#tfPageIndex.pageNumber");
          if (el && !el.classList.contains("unmask")) {
            el.classList.add("unmask");
            console.log("✅ Unmasked on currentPageIndex update");
          }
        },
        configurable: true
      });
    } catch (e) {
      console.warn("⚠️ Failed to override currentPageIndex:", e);
    }
  }

  // ✅ Load main.js last
  dynamicLoading.js('javascript/main.js');
});

  var pageEditorJs = 'javascript/search.js'; // 17 pages ebook
  console.log("pageEditorJs IS --> ", pageEditorJs);

  // ✅ Load config ONCE, then load main viewer
dynamicLoading.js(pageEditorJs, function () {
  if (window.readerConfig) {
    console.log("✅ Config loaded with", window.readerConfig.pages.length, "pages");
    console.log("Total page count is:", window.readerConfig.totalPageCount);
    if (!window.readerConfig.totalPageCount) {
      window.readerConfig.totalPageCount = window.readerConfig.pages.length;
    }
    // Force bookConfig to match readerConfig
    window.bookConfig = window.bookConfig || {};
    window.bookConfig.totalPageCount = window.readerConfig.totalPageCount;
    window.originTotalPageCount = window.readerConfig.totalPageCount;
    console.log("Forced bookConfig.totalPageCount:", window.bookConfig.totalPageCount);
    console.log("Forced originTotalPageCount:", window.originTotalPageCount);
  } else {
    console.warn("⚠️ readerConfig is undefined");
  }
  dynamicLoading.js('javascript/main.js');
}, function () {
  console.error("❌ Failed to load config. Loading main.min.js anyway.");
  dynamicLoading.js('javascript/main.js');
}); 

// Delay until after main.js is loaded
setTimeout(() => {
  const getPageIndex = () => {
    return window.BookInfo?.getBook?.().getCurrentPageIndex?.();
  };

  let lastPage = getPageIndex();

  setInterval(() => {
    const current = getPageIndex();
    if (current && current !== lastPage) {
      lastPage = current;

      const el = document.querySelector("#tfPageIndex.pageNumber");
      if (el && !el.classList.contains("unmask")) {
        el.classList.add("unmask");
        console.log("✅ Unmasked on detected page index change:", current);
      }
    }
  }, 300);
}, 1000); 

 })();