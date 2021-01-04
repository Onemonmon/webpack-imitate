const options = require("./webpack.config");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");
const fs = require("fs");
const path = require("path");

/**
 * @babel
 *  1. @babel/parser: 解析js代码，生成AST抽象语法树
 *  2. @babel/traverse: 对AST的特定节点（参考@babel/types）进行遍历操作
 *  3. @babel/types: 解析AST各个节点的类型
 *  4. @babel/generator: 将AST转换成js代码
 */

const utils = {
  getAst: (path) => {
    const data = fs.readFileSync(path, "utf-8");
    return parser.parse(data, { sourceType: "module" });
  },
  getDependencies: (ast, filename) => {
    const dependencies = {};
    traverse(ast, {
      // import类型
      ImportDeclaration({ node }) {
        const dirname = path.dirname(filename);
        const { value } = node.source;
        const filePath =
          "./" + path.join(dirname, value).replace(/\\/g, "/") + ".js";
        dependencies[value] = filePath;
      },
    });
    return dependencies;
  },
  getCode: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });
    return code;
  },
};

class Compiler {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }
  recursion(dependencies) {
    Object.keys(dependencies).forEach((d) => {
      const res = this.build(dependencies[d]);
      if (Object.keys(res.dependencies).length) {
        this.recursion(res.dependencies);
      }
      this.modules.push(res);
    });
  }
  run() {
    const info = this.build(this.entry);
    this.modules.push(info);
    // 获取入口文件的依赖
    const { dependencies } = info;
    // 递归生成依赖
    this.recursion(dependencies);
    // 使用文件路径作为key，保存依赖和代码
    const dependencyGraph = {};
    this.modules.forEach((m) => {
      dependencyGraph[m.filename] = {
        dependencies: m.dependencies,
        code: m.code,
      };
    });
    this.generate(dependencyGraph);
  }

  build(filename) {
    // 获取AST
    const ast = utils.getAst(filename);
    // 遍历AST，获取所有依赖
    const dependencies = utils.getDependencies(ast, filename);
    // AST => code
    const code = utils.getCode(ast);
    return {
      filename,
      dependencies,
      code,
    };
  }

  generate(dependencyGraph) {
    const filePath = path.join(this.output.path, this.output.filename);
    const bundle = `
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
        require('${this.entry}')
      })(${JSON.stringify(dependencyGraph)})
    `;
    fs.writeFileSync(filePath, bundle, "utf-8");
  }
}

new Compiler(options).run();
