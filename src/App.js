import React, { useState, useEffect, useCallback } from 'react';

// --- 样式系统 ---
const styles = {
  container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '20px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f4f6f8', color: '#333' },
  header: { textAlign: 'center', marginBottom: '30px', color: '#2c3e50', borderBottom: '1px solid #e1e4e8', paddingBottom: '20px' },
  
  // 主布局：左控右显
  gridMain: { display: 'grid', gridTemplateColumns: '420px 1fr', gap: '30px', alignItems: 'start' },
  
  // 卡片通用样式
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px', border: '1px solid #eaHf0f5' },
  sectionTitle: { borderBottom: '2px solid #3498db', paddingBottom: '10px', marginBottom: '15px', color: '#2980b9', fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  
  // 输入控件样式
  inputRow: { display: 'flex', gap: '10px', marginBottom: '12px' },
  inputGroup: { marginBottom: '12px', flex: 1 },
  label: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#555' },
  input: { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dce1e6', fontSize: '14px', backgroundColor: '#fff', boxSizing: 'border-box', transition: 'border 0.2s' },
  range: { width: '100%', cursor: 'pointer', margin: '8px 0' },
  unit: { color: '#7f8c8d', fontWeight: 'normal', marginLeft: '4px' },

  // 结果展示样式
  resultSection: { marginBottom: '25px' },
  resultTitle: { fontSize: '14px', fontWeight: 'bold', color: '#34495e', marginBottom: '10px', paddingLeft: '8px', borderLeft: '4px solid #34495e' },
  resultGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' },
  resultItem: { backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px', border: '1px solid #edf2f7' },
  resultLabel: { display: 'block', fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' },
  resultValue: { display: 'block', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' },
  
  // 状态颜色边框
  borderBlue: { borderTop: '3px solid #3498db' },
  borderGreen: { borderTop: '3px solid #27ae60' },
  borderPurple: { borderTop: '3px solid #9b59b6' },
  borderOrange: { borderTop: '3px solid #e67e22' },

  // 警告框
  warningContainer: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  warningBox: { padding: '10px 15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '6px', fontSize: '13px', border: '1px solid #ffeeba', display: 'flex', alignItems: 'center' },

  // 按钮组
  buttonGroup: { display: 'flex', gap: '15px', marginBottom: '25px', justifyContent: 'center' },
  button: { padding: '10px 30px', cursor: 'pointer', border: 'none', borderRadius: '30px', fontWeight: 'bold', color: 'white', fontSize: '14px', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(50,50,93,0.11)' },

  // 动态图容器
  visualBox: { height: '220px', backgroundColor: '#eef2f7', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '2px dashed #cbd5e0', marginBottom: '20px' },

  // --- 底部逻辑解释板块 ---
  logicContainer: { marginTop: '40px', paddingTop: '30px', borderTop: '2px solid #e1e4e8' },
  logicHeader: { textAlign: 'center', marginBottom: '30px', color: '#2c3e50' },
  logicGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' },
  logicCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e1e4e8' },
  logicTitle: { fontSize: '16px', fontWeight: 'bold', color: '#2980b9', marginBottom: '15px', display: 'flex', alignItems: 'center' },
  logicRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed #eee', fontSize: '13px' },
  logicFormula: { fontFamily: 'Monaco, monospace', backgroundColor: '#f6f8fa', padding: '4px 8px', borderRadius: '4px', color: '#e36209', fontSize: '12px' },
  logicDesc: { color: '#586069', flex: 1, paddingRight: '10px' },
  logicArrow: { margin: '0 10px', color: '#aaa' }
};

const MicrofluidicSimulator = () => {
  // --- 1. 全量状态管理 (Inputs) ---
  const [params, setParams] = useState({
    // A. 几何参数
    nozzleSize: 85, // um
    // B. 试剂体积
    volCell: 140, // uL
    volBead: 50,  // uL
    volOil: 400,  // uL
    cellTotal: 20000, 
    // C. 胶珠物理属性
    beadSize: 52, // um
    packingEfficiency: 0.60, // 0-1
    // D. 流速控制
    qCell: 8, // uL/min
    qBead: 2, // uL/min (浆液)
    qOil: 25, // uL/min
  });

  const [results, setResults] = useState({});
  const [warnings, setWarnings] = useState([]);

  // --- 2. 预设场景 ---
  const loadPreset = (type) => {
    if (type === '10xV4') {
      setParams({
        ...params, nozzleSize: 85, volCell: 75, volBead: 60, volOil: 70, cellTotal: 20000,
        beadSize: 52, packingEfficiency: 0.60, qOil: 60, qCell: 20, qBead: 16 
      });
    } else if (type === 'PDMS') {
      setParams({
        ...params, nozzleSize: 87, volCell: 140, volBead: 50, volOil: 400, cellTotal: 20000,
        beadSize: 52, packingEfficiency: 0.60, qOil: 25, qCell: 8, qBead: 2
      });
    }
  };

  // --- 3. 核心计算逻辑 (Calculation) ---
  // useEffect(() => {
  //   calculateSimulation();
  // }, [calculateSimulation]);// 将 calculateSimulation 添加至此

  // const calculateSimulation = () => {
  // 使用 useCallback 包裹函数
const calculateSimulation = useCallback(() => {
    const { nozzleSize, volCell, volBead, volOil, cellTotal, beadSize, packingEfficiency, qCell, qBead, qOil } = params;
    const errors = [];

    // --- A. 基础物理量 ---
    // 1. 胶珠实体体积 (Solid Volume)
    const beadRadius = beadSize / 2;
    const beadSolidVol_pL = (4 / 3) * Math.PI * Math.pow(beadRadius, 3) / 1000; 

    // 2. 流速拆解 (Mass Balance)
    // 输入的胶珠相流速 qBead 包含固体和载体液
    const flowSolid = qBead * packingEfficiency;       // uL/min (纯固体)
    const flowCarrier = qBead * (1 - packingEfficiency); // uL/min (载体液)
    
    // 进入液滴的总水相流速 (Cell相 + Carrier)
    const flowLiquidTotal = qCell + flowCarrier;
    // 总水相输入流速
    const flowTotalInput = qCell + qBead; 

    // --- B. 液滴生成模型 (Fluid Dynamics) ---
    if (flowTotalInput === 0 || qOil === 0) return;
    const flowRatio = flowTotalInput / qOil; // 水油比 Q_aq / Q_oil
    
    // Scaling Law: D ~ w * (1 + alpha * Q_aq / Q_oil)
    // 1.0 是基础系数，0.5 是流速比影响系数
    const diameterFactor = 1.0 + (0.5 * flowRatio); 
    const dropDiameter = nozzleSize * diameterFactor; 
    const dropVolume_pL = (4/3) * Math.PI * Math.pow(dropDiameter / 2, 3) / 1000;

    // --- C. 液滴内部组分 (Composition) ---
    // 假设均匀混合，液体占比 = 液体流速 / 总流速
    const waterFraction = flowLiquidTotal / flowTotalInput;
    const liquidVolInDrop_pL = dropVolume_pL * waterFraction;
    // const solidVolInDrop_pL = dropVolume_pL * (1 - waterFraction); // 理论计算的固相分配量 变量已赋值但未使用（第 135 行）

    // --- D. 宏观运行指标 (Operations) ---
    const dropVolume_uL = dropVolume_pL / 1e6;
    const frequency = (flowTotalInput / 60) / dropVolume_uL; // Hz (个/秒)
    
    // 运行时间：取决于谁先跑完
    const timeCell = volCell / qCell;
    const timeBead = volBead / qBead;
    const timeOil = volOil / qOil;
    const runTimeMin = Math.min(timeCell, timeBead); 
    const totalDrops = frequency * runTimeMin * 60;

    // --- E. 统计学与捕获 (Statistics) ---
    // 1. 胶珠占有率 (Occupancy)
    const beadSolidVol_uL = beadSolidVol_pL / 1e6;
    // 每分钟有多少颗实体珠子流过？
    const beadsPerMin = flowSolid / beadSolidVol_uL;
    // 每生成一个液滴，平均分配到多少颗珠子？
    let beadOccupancy = beadsPerMin / (frequency * 60);
    
    // 2. 细胞分布 (泊松分布)
    // 考虑胶珠可能先跑完，导致剩下的细胞被浪费
    const cellUtilization = runTimeMin / timeCell; 
    const effectiveCellInput = cellTotal * cellUtilization;
    const lambda = effectiveCellInput / totalDrops; // 平均每滴细胞数
    
    const p_0 = Math.exp(-lambda);
    const p_1 = lambda * Math.exp(-lambda); // 单细胞率
    const p_multi = 1 - p_0 - p_1; // 多细胞率
    const doubletRatePct = (p_multi / (p_1 + p_multi)) * 100;
    
    // 3. 最终捕获
    // 有效液滴 = 有珠子(最大100%) * 有单个细胞
    const effectiveOccupancy = beadOccupancy > 1 ? 1 : beadOccupancy; 
    const capturedCells = totalDrops * effectiveOccupancy * p_1;
    const efficiency = (capturedCells / cellTotal) * 100;

    // --- F. 警报逻辑 ---
    if (qOil < flowTotalInput) errors.push("⚠️ 射流风险 (Jetting): 油流速 < 水流速，无法稳定切断液滴！");
    if (dropDiameter < beadSize) errors.push("⛔ 物理堵塞: 液滴直径 < 胶珠直径！");
    if (beadOccupancy > 1.2) errors.push("⚠️ 胶珠过载: Occupancy > 120%，将出现双珠 (Doublet Beads)。");
    if (timeOil < runTimeMin) errors.push("⚠️ 油量不足: 油相将最先耗尽，实验中断！");
    if (timeBead < timeCell * 0.8) errors.push(`⚠️ 试剂浪费: 胶珠将提前 ${ (timeCell - timeBead).toFixed(1) } 分钟耗尽。`);

    setWarnings(errors);
    setResults({
      // 物理结果
      dropDiameter: dropDiameter.toFixed(1),
      dropVolume: dropVolume_pL.toFixed(0),
      beadSolidVol: beadSolidVol_pL.toFixed(0),
      liquidVol: liquidVolInDrop_pL.toFixed(0),
      liquidRatio: (waterFraction * 100).toFixed(1),
      // 运行结果
      frequency: frequency.toFixed(0),
      runTime: runTimeMin.toFixed(1),
      totalDrops: Math.floor(totalDrops).toLocaleString(),
      timeCell: timeCell.toFixed(1),
      timeBead: timeBead.toFixed(1),
      // 统计结果
      beadOccupancy: (beadOccupancy * 100).toFixed(1),
      lambda: lambda.toFixed(3),
      doubletRate: doubletRatePct.toFixed(2),
      capturedCells: Math.floor(capturedCells).toLocaleString(),
      efficiency: efficiency.toFixed(1),
      // 逻辑展示专用数据
      flowRatio: flowRatio.toFixed(2),
      flowSolid: flowSolid.toFixed(2),
      flowLiquidTotal: flowLiquidTotal.toFixed(2),
      flowTotalInput: flowTotalInput.toFixed(2)
    });
  }, [params]); // 注意：这是 useCallback 的依赖数组
// 使用稳定的 calculateSimulation 函数作为依赖
  useEffect(() => {
    calculateSimulation();
  }, [calculateSimulation]); // 将 calculateSimulation 添加至此

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParams({ ...params, [name]: parseFloat(value) });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🧬 单细胞微流控全真模拟器 v3.0 (完整版)</h1>
      
      <div style={styles.buttonGroup}>
        <button style={{...styles.button, backgroundColor: '#8e44ad'}} onClick={() => loadPreset('10xV4')}>加载: 10x V4 模式</button>
        <button style={{...styles.button, backgroundColor: '#27ae60'}} onClick={() => loadPreset('PDMS')}>加载: PDMS 自研模式</button>
      </div>

      <div style={styles.gridMain}>
        {/* === 左侧：全参数输入 === */}
        <div>
          {/* 1. 几何与胶珠 */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}><span>1. 芯片几何 & 胶珠属性</span><span>🛠️</span></div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>胶珠直径 (μm) <span style={{color:'#3498db'}}>{params.beadSize}</span></label>
              <input type="range" min="30" max="80" name="beadSize" value={params.beadSize} onChange={handleInputChange} style={styles.range} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>堆积率 (Packing Efficiency) <span style={{color:'#3498db'}}>{params.packingEfficiency}</span></label>
              <input type="range" min="0.1" max="0.9" step="0.05" name="packingEfficiency" value={params.packingEfficiency} onChange={handleInputChange} style={styles.range} />
              <small style={{color:'#95a5a6'}}>* 0.60=沉降浓浆, 决定固液比</small>
            </div>
            <div style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>喷嘴宽度 (μm)</label>
                <input type="number" name="nozzleSize" value={params.nozzleSize} onChange={handleInputChange} style={styles.input} />
              </div>
            </div>
          </div>

          {/* 2. 试剂体积 */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}><span>2. 试剂体积 (Volumes)</span><span>🧪</span></div>
            <div style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Cell 相 (μL)</label>
                <input type="number" name="volCell" value={params.volCell} onChange={handleInputChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Bead 相 (μL)</label>
                <input type="number" name="volBead" value={params.volBead} onChange={handleInputChange} style={styles.input} />
              </div>
            </div>
            <div style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Oil 相 (μL)</label>
                <input type="number" name="volOil" value={params.volOil} onChange={handleInputChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>细胞总数</label>
                <input type="number" name="cellTotal" value={params.cellTotal} onChange={handleInputChange} style={styles.input} />
              </div>
            </div>
          </div>

          {/* 3. 流速控制 */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}><span>3. 流速控制 (Flow Rates)</span><span>🌊</span></div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Oil 流速 <span style={{color:'#2c3e50'}}>{params.qOil} μL/min</span></label>
              <input type="range" min="10" max="100" name="qOil" value={params.qOil} onChange={handleInputChange} style={styles.range} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cell 流速 <span style={{color:'#2c3e50'}}>{params.qCell} μL/min</span></label>
              <input type="range" min="1" max="50" name="qCell" value={params.qCell} onChange={handleInputChange} style={styles.range} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Bead 流速 (浆液) <span style={{color:'#2c3e50'}}>{params.qBead} μL/min</span></label>
              <input type="range" min="1" max="30" name="qBead" value={params.qBead} onChange={handleInputChange} style={styles.range} />
            </div>
          </div>
        </div>

        {/* === 右侧：全结果展示 === */}
        <div>
          <div style={styles.card}>
            <div style={styles.sectionTitle}><span>预测仪表盘</span><span>📊</span></div>
            
            {/* 动态示意图 */}
            <div style={styles.visualBox}>
              <div style={{
                width: `${results.dropDiameter * 1.5}px`,
                height: `${results.dropDiameter * 1.5}px`,
                backgroundColor: 'rgba(52, 152, 219, 0.15)',
                borderRadius: '50%',
                border: '2px solid #3498db',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                <div style={{
                  width: `${params.beadSize * 1.5}px`,
                  height: `${params.beadSize * 1.5}px`,
                  backgroundColor: 'rgba(46, 204, 113, 0.8)',
                  borderRadius: '50%',
                  border: '1px solid #27ae60',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: '#fff',
                  transition: 'all 0.5s ease'
                }}>
                  Bead
                </div>
              </div>
              <div style={{position:'absolute', bottom:10, right:15, fontSize:'11px', color:'#7f8c8d', textAlign:'right'}}>
                <div>💧 液滴: {results.dropDiameter} μm</div>
                <div>🟢 胶珠: {params.beadSize} μm</div>
              </div>
            </div>

            {/* 警告区 */}
            {warnings.length > 0 && (
              <div style={styles.warningContainer}>
                {warnings.map((w, i) => <div key={i} style={styles.warningBox}><span>{w}</span></div>)}
              </div>
            )}

            {/* 结果分块展示 */}
            <div style={styles.resultSection}>
              <div style={styles.resultTitle}>A. 微观物理 (Micro-Physics)</div>
              <div style={styles.resultGrid}>
                <div style={{...styles.resultItem, ...styles.borderBlue}}>
                  <span style={styles.resultLabel}>单液滴体积</span>
                  <span style={styles.resultValue}>{results.dropVolume} pL</span>
                </div>
                <div style={{...styles.resultItem, ...styles.borderBlue}}>
                  <span style={styles.resultLabel}>液体/水相占比</span>
                  <span style={styles.resultValue}>{results.liquidRatio}%</span>
                </div>
                <div style={{...styles.resultItem, ...styles.borderGreen}}>
                  <span style={styles.resultLabel}>单胶珠体积</span>
                  <span style={styles.resultValue}>{results.beadSolidVol} pL</span>
                </div>
                <div style={{...styles.resultItem, ...styles.borderGreen}}>
                  <span style={styles.resultLabel}>胶珠占有率 (Occupancy)</span>
                  <span style={styles.resultValue}>{results.beadOccupancy}%</span>
                </div>
              </div>
            </div>

            <div style={styles.resultSection}>
              <div style={styles.resultTitle}>B. 宏观运行 (Operations)</div>
              <div style={styles.resultGrid}>
                <div style={{...styles.resultItem, ...styles.borderPurple}}>
                  <span style={styles.resultLabel}>生成频率</span>
                  <span style={styles.resultValue}>{results.frequency} Hz</span>
                </div>
                <div style={{...styles.resultItem, ...styles.borderPurple}}>
                  <span style={styles.resultLabel}>有效运行时间</span>
                  <span style={styles.resultValue}>{results.runTime} min</span>
                </div>
                <div style={{...styles.resultItem, ...styles.borderPurple}}>
                  <span style={styles.resultLabel}>液滴总产量</span>
                  <span style={styles.resultValue}>{results.totalDrops}</span>
                </div>
              </div>
            </div>

            <div style={{padding:'15px', backgroundColor:'#e8f8f5', borderRadius:'10px', border:'1px solid #d1f2eb'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                <span style={{fontSize:'14px', fontWeight:'bold', color:'#16a085'}}>C. 最终捕获预测 (Statistics)</span>
                <span style={{fontSize:'12px', color:'#16a085', backgroundColor:'#d1f2eb', padding:'2px 6px', borderRadius:'4px'}}>Lambda: {results.lambda}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                <div>
                  <span style={{display:'block', fontSize:'12px', color:'#7f8c8d'}}>捕获单细胞数</span>
                  <span style={{display:'block', fontSize:'28px', fontWeight:'bold', color:'#0e6655'}}>{results.capturedCells}</span>
                </div>
                <div style={{textAlign:'right'}}>
                   <div style={{marginBottom:'4px'}}><span style={{fontSize:'12px', color:'#7f8c8d'}}>捕获效率:</span> <span style={{fontSize:'16px', fontWeight:'bold', color:'#16a085'}}>{results.efficiency}%</span></div>
                   <div><span style={{fontSize:'12px', color:'#7f8c8d'}}>双细胞率:</span> <span style={{fontSize:'16px', fontWeight:'bold', color:'#e67e22'}}>{results.doubletRate}%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === 底部：核心逻辑全解 (Logic Panel) === */}
      <div style={styles.logicContainer}>
        <h2 style={styles.logicHeader}>📚 参数逻辑全解 (Logic & Formulas)</h2>
        
        <div style={styles.logicGrid}>
          {/* 1. 流体动力学 */}
          <div style={styles.logicCard}>
            <div style={styles.logicTitle}>🌊 1. 液滴生成逻辑 (Fluid Dynamics)</div>
            
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}><b>输入参数:</b> 喷嘴({params.nozzleSize}μm), 流速比(水/油)</div>
            </div>
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}><b>计算公式:</b></div>
              <div style={styles.logicFormula}>D ≈ Nozzle × (1 + 0.5 × Q_aq/Q_oil)</div>
            </div>
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}>
                当前总水相流速为 <b>{results.flowTotalInput}</b>，油相为 <b>{params.qOil}</b>。<br/>
                水油流速比 (Flow Ratio) 为 <b>{results.flowRatio}</b>。<br/>
                这导致液滴直径在喷嘴基础上膨胀了 <b>{(1 + 0.5 * parseFloat(results.flowRatio)).toFixed(2)}倍</b>。
              </div>
              <div style={styles.logicArrow}>➔</div>
              <div style={styles.logicDesc}><b>结果:</b> 液滴直径 {results.dropDiameter} μm</div>
            </div>
          </div>

          {/* 2. 物质守恒与组分 */}
          <div style={styles.logicCard}>
            <div style={styles.logicTitle}>🧪 2. 组分守恒逻辑 (Mass Balance)</div>
            
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}><b>输入参数:</b> 堆积率({params.packingEfficiency}), 各相流速</div>
            </div>
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}><b>计算公式:</b></div>
              <div style={styles.logicFormula}>Q_liquid = Q_cell + Q_bead × (1 - Packing)</div>
            </div>
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}>
                Bead相是浆液。根据堆积率，Bead流速拆分为：<br/>
                • 固体: <b>{results.flowSolid} uL/min</b><br/>
                • 液体: <b>{(params.qBead - parseFloat(results.flowSolid)).toFixed(2)} uL/min</b><br/>
                加上Cell相，总液体流速为 <b>{results.flowLiquidTotal} uL/min</b>。
              </div>
              <div style={styles.logicArrow}>➔</div>
              <div style={styles.logicDesc}><b>结果:</b> 液体占比 {results.liquidRatio}%</div>
            </div>
          </div>

          {/* 3. 运行时间与频率 */}
          <div style={styles.logicCard}>
            <div style={styles.logicTitle}>⏱️ 3. 运行逻辑 (Operations)</div>
            
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}><b>输入参数:</b> 试剂体积, 总流速, 液滴体积</div>
            </div>
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}><b>计算公式:</b></div>
              <div style={styles.logicFormula}>Time = min(Vol_cell/Q_cell, Vol_bead/Q_bead)</div>
            </div>
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}>
                Cell相可跑 <b>{results.timeCell} min</b>，Bead相可跑 <b>{results.timeBead} min</b>。<br/>
                实验将在最快耗尽的一相停止。
                频率 = 总流速 / 单液滴体积。
              </div>
              <div style={styles.logicArrow}>➔</div>
              <div style={styles.logicDesc}><b>结果:</b> 运行 {results.runTime} min</div>
            </div>
          </div>

          {/* 4. 统计学概率 */}
          <div style={styles.logicCard}>
            <div style={styles.logicTitle}>🎲 4. 捕获概率逻辑 (Poisson Stats)</div>
            
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}><b>输入参数:</b> 细胞总数, 液滴产量, 珠子流速</div>
            </div>
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}><b>计算公式:</b></div>
              <div style={styles.logicFormula}>Eff = P(Bead≥1) × P(Cell=1)</div>
            </div>
            <div style={styles.logicRow}>
              <div style={styles.logicDesc}>
                1. <b>有珠率</b>: 珠子颗粒流速/液滴频率 = <b>{results.beadOccupancy}%</b>。<br/>
                2. <b>有单细胞率</b>: 根据 Lambda ({results.lambda}) 的泊松分布。<br/>
                只有两者同时满足，才算有效捕获。
              </div>
              <div style={styles.logicArrow}>➔</div>
              <div style={styles.logicDesc}><b>结果:</b> 效率 {results.efficiency}%</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MicrofluidicSimulator;