---
name: graphrag-design
description: GraphRAG 知识管理模块设计文档
type: reference
---

# GraphRAG 知识管理模块设计

## 文档位置

`/Users/Zhuanz/Desktop/workspace/.claude/worktrees/graph-rag/docs/superpowers/specs/2026-04-08-graphrag-design.md`

## 核心决策

| 决策点 | 选项 |
|-------|------|
| GraphRAG 实现 | 微软 GraphRAG（选项 A），预留迁移到自研（选项 C） |
| 部署方式 | 独立服务（localhost:8002） |
| 多租户 | 暂不需要，namespace 扩展点预留 |
| 可视化 | 前端 ECharts 渲染 |
| 实时查询 | 独立接口 + 调用方注入 context |

## 关键文件

- 设计文档：`docs/superpowers/specs/2026-04-08-graphrag-design.md`
- 任务清单：TaskList（Task #1-6）

## API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/v1/index` | POST | 索引文档 |
| `/api/v1/query` | POST | 知识查询（含动态 top_k） |
| `/api/v1/summarize` | POST | 全局汇总 |
| `/api/v1/graph` | GET | 图谱可视化 |
| `/api/v1/documents` | GET | 文档列表 |
| `/api/v1/documents/{id}` | DELETE | 删除文档 |
| `/api/v1/realtime/query` | POST | 实时上下文注入查询 |

## 实施阶段

1. 项目脚手架（Task #1）✅
2. GraphRAG Core 微软适配层（Task #2）✅
3. SQLite 存储层（Task #3）✅
4. 核心 API（Task #4）✅
5. 图谱可视化（Task #5）✅
6. 实时上下文注入（Task #6）✅

## 实现状态

**已完成**
- 代码位置：`graphrag-service/`
- 文档：`graphrag-service/CLAUDE.md`
- 服务入口：`uvicorn app.main:app --port 8002`

**关键实现文件**
- `app/core/base.py` - GraphRAGCore 抽象接口
- `app/core/microsoft/adapter.py` - 微软 GraphRAG 适配层
- `app/storage/database.py` - SQLite 存储层
- `app/api/v1/*.py` - REST API 端点
