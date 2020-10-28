
      !(function(graph){
        function require(module){
          function localRequire(rp) {
            return require(graph[module].dependencies[rp])
          }
          var exports = {}
          !(function(require, exports, code){
            eval(code)
          })(localRequire, exports, graph[module].code)
          return exports;
        }
        require('./src/index.js')
      })({"./src/index.js":{"dependencies":{"./a":"./src/a.js","./b":"./src/b.js"},"code":"\"use strict\";\n\nvar _a = _interopRequireDefault(require(\"./a\"));\n\nvar _b = _interopRequireDefault(require(\"./b\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log(_a[\"default\"] + _b[\"default\"]);"},"./src/com/c.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar c = 2;\nvar _default = c;\nexports[\"default\"] = _default;"},"./src/a.js":{"dependencies":{"./com/c":"./src/com/c.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _c = _interopRequireDefault(require(\"./com/c\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar a = 2;\n\nvar _default = a + _c[\"default\"];\n\nexports[\"default\"] = _default;"},"./src/b.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar b = 2;\nvar _default = b;\nexports[\"default\"] = _default;"}})
    