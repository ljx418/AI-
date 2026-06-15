/**
 * Knowledge Graph v1.0 - 知识图谱可视化
 * 支持35课图谱、关联学习、交互探索、搜索定位
 */
import React, { useState, useEffect, useRef } from 'react';

// 35课知识图谱数据
const LESSON_GRAPH = {
  nodes: [
    // Week 1-4: 基础
    { id: 'L01', label: 'L01 Python基础', group: 1, category: '编程基础' },
    { id: 'L02', label: 'L02 NumPy数据', group: 1, category: '数据处理' },
    { id: 'L03', label: 'L03 Pandas分析', group: 1, category: '数据处理' },
    { id: 'L04', label: 'L04 Matplotlib', group: 1, category: '数据可视化' },
    { id: 'L05', label: 'L05 线性代数', group: 1, category: '数学基础' },
    { id: 'L06', label: 'L06 概率统计', group: 1, category: '数学基础' },
    // Week 5-8: ML
    { id: 'L07', label: 'L07 机器学习入门', group: 2, category: '机器学习' },
    { id: 'L08', label: 'L08 线性回归', group: 2, category: '机器学习' },
    { id: 'L09', label: 'L09 逻辑回归', group: 2, category: '机器学习' },
    { id: 'L10', label: 'L10 决策树', group: 2, category: '机器学习' },
    { id: 'L11', label: 'L11 SVM支持向量机', group: 2, category: '机器学习' },
    { id: 'L12', label: 'L12 集成学习', group: 2, category: '机器学习' },
    // Week 9-12: DL
    { id: 'L13', label: 'L13 神经网络基础', group: 3, category: '深度学习' },
    { id: 'L14', label: 'L14 BP反向传播', group: 3, category: '深度学习' },
    { id: 'L15', label: 'L15 CNN卷积神经网络', group: 3, category: '深度学习' },
    { id: 'L16', label: 'L16 RNN循环神经网络', group: 3, category: '深度学习' },
    { id: 'L17', label: 'L17 LSTM长短期记忆', group: 3, category: '深度学习' },
    { id: 'L18', label: 'L18 Transformer架构', group: 3, category: '深度学习' },
    // Week 13-16: NLP
    { id: 'L19', label: 'L19 NLP基础', group: 4, category: '自然语言处理' },
    { id: 'L20', label: 'L20 Word2Vec', group: 4, category: '自然语言处理' },
    { id: 'L21', label: 'L21 BERT预训练', group: 4, category: '自然语言处理' },
    { id: 'L22', label: 'L22 文本分类', group: 4, category: '自然语言处理' },
    { id: 'L23', label: 'L23 序列到序列', group: 4, category: '自然语言处理' },
    { id: 'L24', label: 'L24 命名实体识别', group: 4, category: '自然语言处理' },
    // Week 17-20: LLM
    { id: 'L25', label: 'L25 DeepSeek架构', group: 5, category: '大语言模型' },
    { id: 'L26', label: 'L26 LoRA微调', group: 5, category: '大语言模型' },
    { id: 'L27', label: 'L27 Agent开发', group: 5, category: '大语言模型' },
    { id: 'L28', label: 'L28 DPO对齐', group: 5, category: '大语言模型' },
    { id: 'L29', label: 'L29 vLLM推理', group: 5, category: '大语言模型' },
    { id: 'L30', label: 'L30 DeepSpeed分布式', group: 5, category: '大语言模型' },
    // Week 21-24: RAG & 应用
    { id: 'L31', label: 'L31 RAG优化', group: 6, category: 'RAG应用' },
    { id: 'L32', label: 'L32 多模态模型', group: 6, category: '多模态' },
    { id: 'L33', label: 'L33 LLM评测', group: 6, category: 'LLM评测' },
    { id: 'L34', label: 'L34 行业案例', group: 6, category: '应用案例' },
    { id: 'L35', label: 'L35 面试准备', group: 6, category: '求职面试' },
  ],
  edges: [
    // 基础 -> ML
    { from: 'L01', to: 'L02' }, { from: 'L02', to: 'L03' }, { from: 'L03', to: 'L04' },
    { from: 'L05', to: 'L06' }, { from: 'L06', to: 'L07' },
    // ML -> DL
    { from: 'L07', to: 'L08' }, { from: 'L08', to: 'L09' }, { from: 'L09', to: 'L10' },
    { from: 'L10', to: 'L11' }, { from: 'L11', to: 'L12' }, { from: 'L12', to: 'L13' },
    // DL -> NLP
    { from: 'L13', to: 'L14' }, { from: 'L14', to: 'L15' }, { from: 'L15', to: 'L16' },
    { from: 'L16', to: 'L17' }, { from: 'L17', to: 'L18' }, { from: 'L18', to: 'L19' },
    // NLP -> LLM
    { from: 'L19', to: 'L20' }, { from: 'L20', to: 'L21' }, { from: 'L21', to: 'L22' },
    { from: 'L22', to: 'L23' }, { from: 'L23', to: 'L24' }, { from: 'L18', to: 'L24' },
    // LLM 进阶
    { from: 'L24', to: 'L25' }, { from: 'L25', to: 'L26' }, { from: 'L26', to: 'L27' },
    { from: 'L27', to: 'L28' }, { from: 'L28', to: 'L29' }, { from: 'L29', to: 'L30' },
    // RAG & 应用
    { from: 'L30', to: 'L31' }, { from: 'L31', to: 'L32' },
    { from: 'L32', to: 'L33' }, { from: 'L33', to: 'L34' },
    { from: 'L34', to: 'L35' },
    // 跨领域关联
    { from: 'L15', to: 'L32' }, // CNN -> 多模态
    { from: 'L21', to: 'L25' }, // BERT -> DeepSeek
    { from: 'L18', to: 'L29' }, // Transformer -> vLLM
  ]
};

const GROUP_COLORS = {
  1: '#22c55e', // 编程基础
  2: '#3b82f6', // 机器学习
  3: '#8b5cf6', // 深度学习
  4: '#f59e0b', // NLP
  5: '#ec4899', // 大语言模型
  6: '#ef4444', // RAG/应用
};

const GROUP_NAMES = {
  1: '编程基础',
  2: '机器学习',
  3: '深度学习',
  4: '自然语言处理',
  5: '大语言模型',
  6: 'RAG与应用',
};

export default function KnowledgeGraph() {
  const [graph] = useState(LESSON_GRAPH);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNodes, setFilteredNodes] = useState([]);
  const containerRef = useRef(null);

  // 布局计算
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = 400;
    const centerX = width / 2, centerY = height / 2, radius = Math.min(width, height) / 3;

    // 按组分组
    const groups = {};
    graph.nodes.forEach(node => {
      if (!groups[node.group]) groups[node.group] = [];
      groups[node.group].push(node);
    });

    // 每组环形布局
    let groupAngle = 0;
    Object.entries(groups).forEach(([group, nodes]) => {
      const groupAngleStep = (2 * Math.PI) / nodes.length;
      nodes.forEach((node, i) => {
        const angle = groupAngle + i * groupAngleStep;
        node.x = centerX + radius * Math.cos(angle);
        node.y = centerY + radius * Math.sin(angle);
      });
      groupAngle += Math.PI / 6;
    });
  }, [graph]);

  // 搜索过滤
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNodes([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = graph.nodes.filter(n =>
      n.label.toLowerCase().includes(query) || n.category.toLowerCase().includes(query)
    );
    setFilteredNodes(filtered);
  }, [searchQuery, graph]);

  // 跳转节点
  const jumpToNode = (nodeId) => {
    const node = graph.nodes.find(n => n.id === nodeId);
    if (node) {
      setSelected(node);
      setSearchQuery('');
      setFilteredNodes([]);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>Knowledge Graph v1.0 - 35课知识图谱</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
        {/* 图谱画布 */}
        <div ref={containerRef} style={{ height: 450, background: '#0f172a', borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100%">
            {/* 边 */}
            {graph.edges.map((e, i) => {
              const from = graph.nodes.find(n => n.id === e.from);
              const to = graph.nodes.find(n => n.id === e.to);
              if (!from || !to) return null;
              const isHighlight = hovered && (hovered === e.from || hovered === e.to);
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={isHighlight ? '#fff' : '#334155'}
                  strokeWidth={isHighlight ? 2 : 1}
                  opacity={hovered && !isHighlight ? 0.3 : 0.7}
                />
              );
            })}
            {/* 节点 */}
            {graph.nodes.map(node => {
              const isSelected = selected?.id === node.id;
              const isHovered = hovered === node.id;
              const isFiltered = filteredNodes.some(n => n.id === node.id);
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  onClick={() => setSelected(node)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    r={isSelected ? 18 : isHovered ? 16 : 12}
                    fill={GROUP_COLORS[node.group]}
                    opacity={isFiltered || filteredNodes.length === 0 ? (isHovered ? 1 : 0.85) : 0.3}
                    stroke={isSelected ? '#fff' : 'none'}
                    strokeWidth={2}
                  />
                  <text
                    y={isHovered ? 30 : 24}
                    textAnchor="middle"
                    fill="white"
                    fontSize={isHovered ? '10' : '8'}
                    fontFamily="system-ui"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 侧边栏 */}
        <div>
          {/* 搜索 */}
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索课程..."
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
            />
            {filteredNodes.length > 0 && (
              <div style={{ maxHeight: 150, overflow: 'auto', marginTop: 8 }}>
                {filteredNodes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => jumpToNode(n.id)}
                    style={{ padding: '6px 8px', marginBottom: 4, background: '#f1f5f9', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    {n.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 图例 */}
          <h3 style={{ fontSize: '0.9rem', marginBottom: 12 }}>图例</h3>
          {Object.entries(GROUP_NAMES).map(([g, name]) => (
            <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.8rem' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: GROUP_COLORS[g] }} />
              <span>{name}</span>
            </div>
          ))}

          {/* 统计 */}
          <h3 style={{ fontSize: '0.9rem', marginTop: 16, marginBottom: 12 }}>统计</h3>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            <div>节点: {graph.nodes.length}</div>
            <div>边: {graph.edges.length}</div>
          </div>

          {/* 选中详情 */}
          {selected && (
            <div style={{ marginTop: 16, padding: 12, background: '#f1f5f9', borderRadius: 8 }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: 8 }}>{selected.label}</h4>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                <div>分类: {selected.category}</div>
                <div>周目: 第{Math.ceil(parseInt(selected.id.slice(1)) / 6)}周</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function KnowledgeGraphDemo() {
  return (
    <div style={{ padding: 20 }}>
      <h3>Knowledge Graph v1.0</h3>
      <KnowledgeGraph />
    </div>
  );
}