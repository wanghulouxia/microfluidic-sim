# 微流控单细胞模拟器

一个基于 React 的前端模拟工具，用于快速评估单细胞微流控参数（液滴直径、胶珠占有率、双胞率、捕获效率等）之间的关系。

演示地址：<https://microfluidic-sim.netlify.app/>

## 项目结构
- `src/`：核心源码（界面、计算逻辑、测试）。
- `public/`：静态资源与 HTML 模板。
- `build/`：生产构建输出目录。

## 本地开发
1. 安装依赖
```bash
npm install
```
2. 启动开发环境
```bash
npm start
```
默认访问：<http://localhost:3000>

## 常用命令
- `npm start`：本地开发与热更新。
- `npm test`：运行测试（Jest + React Testing Library）。
- `npm run build`：生成生产版本到 `build/`。

## 10x 预设参数（当前默认）
- `nozzleSize = 54.29 μm`
- `qCell = 17 μL/min`
- `qOil = 15.87 μL/min`
- `qBead = 6.8 μL/min`
- 其余保持：`volCell=75`、`volBead=60`、`volOil=70`、`beadSize=52`、`packingEfficiency=0.60`

## 说明
- 该项目目前采用简化物理模型，结果用于参数探索与相对比较，不应直接替代实验标定。
