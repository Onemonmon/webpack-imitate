#### build 函数的作用：

**入参：**
文件路径
**出参：**
文件路径
依赖的文件名和文件路径组成的数组对象: [{'./xx', './xx/xx/xx'}]
可执行代码

先读取文件内容
通过@babel/parser 获得其 AST
然后使用@babel/tarverse 遍历 AST 中所有的 ImportDeclaration 类型的节点，得到该节点对应的文件名和路径
再使用@babel/core 中的 transformFromAst，将语法树转换成可执行代码

#### 编译步骤

先编译入口文件，获取入口文件依赖的文件
递归 build 这些依赖对象
生成最终的依赖图：{'依赖名 1': {dependencies: 'xxx', code: 'xxx'}, '依赖名 2': {dependencies: 'xxx', code: 'xxx'}}
