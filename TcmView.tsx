import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, FileJson, Sparkles, ArrowRight, BookOpen, ListVideo, Loader2, Terminal, Calculator, Clock, Play, Stethoscope, Quote, Scan, Brain, Check, X, RotateCcw } from 'lucide-react';

export const TcmView: React.FC<{ activeSubTab: string }> = ({ activeSubTab }) => {
  // --- State for Prompt Lab ---
  const [symptoms, setSymptoms] = useState("患者面色苍白，神疲乏力，少气懒言，舌淡苔白，脉虚无力。");
  const [promptStep, setPromptStep] = useState(0); // 0: idle, 1: typing, 2: thinking, 3: extracted

  // --- State for Batch Lab ---
  const [batchStatus, setBatchStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [activeItem, setActiveItem] = useState(-1);
  const [processedItems, setProcessedItems] = useState<number[]>([]);
  
  // Track timers for cleanup to prevent white-screen crashes
  const timersRef = useRef<number[]>([]); 

  const batchItems = [
    { id: 101, text: "发热，咽痛，舌红苔黄" },
    { id: 102, text: "头晕目眩，腰膝酸软" },
    { id: 103, text: "胃脘胀痛，嗳气吞酸" },
    { id: 104, text: "心悸失眠，纳差便溏" },
  ];

  // --- State for Eval Lab ---
  const [evalMode, setEvalMode] = useState<'calc' | 'space'>('calc'); // 'calc': Cosine Sim, 'space': Embedding Map
  const [simScore, setSimScore] = useState<number | null>(null);

  // --- Batch Processing Logic (Fixes Crash) ---
  const clearTimers = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => clearTimers();
  }, []);

  // Handle Reset separately
  const handleBatchReset = () => {
      clearTimers();
      setBatchStatus('idle');
      setActiveItem(-1);
      setProcessedItems([]);
  };

  const startBatchProcess = () => {
      // Clear any existing runs first
      clearTimers();
      
      setBatchStatus('running');
      setProcessedItems([]);
      setActiveItem(-1);
      
      let currentIndex = 0;
      
      const processNext = () => {
          // Check if user hit reset or component unmounted (ref checking implied by timeout clearance)
          if (currentIndex >= batchItems.length) {
              setBatchStatus('finished');
              setActiveItem(-1);
              return;
          }

          // 1. Set Active Item (Accelerated)
          setActiveItem(currentIndex);

          // 2. Simulate API Call (300ms)
          const t1 = window.setTimeout(() => {
              setProcessedItems(prev => [...prev, currentIndex]);
              currentIndex++;
              
              // 3. Rate Limit Sleep (200ms)
              const t2 = window.setTimeout(() => {
                  processNext();
              }, 200); 
              timersRef.current.push(t2);

          }, 300);
          timersRef.current.push(t1);
      };

      // Start the chain
      processNext();
  };


  // Prompt Simulation
  const runPrompt = () => {
     setPromptStep(1);
     setTimeout(() => setPromptStep(2), 1500); // Typing prompt
     setTimeout(() => setPromptStep(3), 3500); // LLM responding + Extracting
  };

  // --- Render Functions for Sub-Views ---

  const renderIntro = () => (
    <div className="h-full flex flex-col animate-fade-in-up">
        <div className="p-4 lg:p-6 border-b border-emerald-100 bg-emerald-50/30 flex-shrink-0">
          <h2 className="text-xl lg:text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <BookOpen className="text-emerald-600" /> 0. 项目背景 (Context)
          </h2>
          <p className="text-emerald-700 mt-2 text-xs lg:text-sm">
            基于大语言模型的智能中医辨证系统，服务于慢性淋巴细胞白血病(CLL)的复杂诊疗辅助。
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50 min-h-0">
           <div className="max-w-4xl mx-auto space-y-8 pb-10">
               <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-200">
                   <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                       <Stethoscope className="text-rose-500" /> 医疗痛点：非结构化数据的挑战
                   </h3>
                   <div className="flex flex-col md:flex-row gap-8 items-start">
                       <div className="flex-1 space-y-4 text-xs lg:text-sm text-slate-600 leading-relaxed">
                           <p>
                               <strong>慢性淋巴细胞白血病 (CLL)</strong> 是一种进展缓慢的血液系统恶性肿瘤。在中医临床中，其症状表现<span className="text-rose-600 font-bold">复杂多样</span>，个体差异极大。
                           </p>
                           <p>传统诊疗面临挑战：</p>
                           <ul className="list-disc pl-5 space-y-2 marker:text-emerald-500">
                               <li><b>数据混乱：</b> 医生手写的病历多为自由文本，难以进行大规模统计分析。</li>
                               <li><b>标准不一：</b> 不同医生对“证型”的判断可能存在主观差异。</li>
                               <li><b>经验依赖：</b> 初级医生难以快速匹配准确的“治法”。</li>
                           </ul>
                       </div>
                       <div className="w-full md:w-72 bg-slate-100 rounded-xl p-4 border border-slate-200 flex flex-col gap-3 shadow-inner">
                           <div className="bg-white p-3 rounded shadow-sm border border-slate-200 text-xs">
                               <div className="font-bold text-slate-700 mb-1 flex items-center gap-2"><Quote size={10}/> 原始病历</div>
                               <div className="text-slate-500 italic">"患者自觉神疲乏力，午后低热，手足心热，盗汗，舌红少苔..."</div>
                           </div>
                           <ArrowRight className="text-slate-400 self-center transform rotate-90 md:rotate-0" />
                           <div className="bg-emerald-50 p-3 rounded shadow-sm border border-emerald-100 text-xs">
                               <div className="font-bold text-emerald-700 mb-1 flex items-center gap-2"><Scan size={10}/> 结构化输出</div>
                               <div className="text-emerald-600 font-mono">
                                   {'{"证型": "气阴两虚", "治法": "益气养阴"}'}
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
        </div>
    </div>
  );

  const renderPrompt = () => (
    <div className="h-full flex flex-col animate-fade-in-up">
      <div className="p-4 lg:p-6 border-b border-emerald-100 bg-emerald-50/30 flex-shrink-0">
        <h2 className="text-xl lg:text-2xl font-bold text-emerald-900 flex items-center gap-2">
          <MessageSquare className="text-emerald-600" /> 1. 提示工程 (Prompt Engineering)
        </h2>
        <p className="text-emerald-700 mt-2 text-xs lg:text-sm">
           System Prompt 引导大模型输出 JSON，Regex 正则表达式负责清洗结果。
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-50 min-h-0">
        {/* Left: Lab */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex flex-col gap-6 min-w-0 min-h-0">
           
           {/* Input */}
           <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm transition-all flex-shrink-0">
               <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">1. 患者症状输入 (User Input)</label>
               <textarea 
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 h-20 resize-none transition-all"
               />
               <div className="mt-3 flex justify-end">
                  <button 
                     onClick={runPrompt}
                     disabled={promptStep > 0 && promptStep < 3}
                     className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200"
                  >
                     {promptStep > 0 && promptStep < 3 ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16} />}
                     {promptStep > 0 && promptStep < 3 ? 'AI 处理中...' : '生成诊断'}
                  </button>
               </div>
           </div>

           {/* System Prompt Animation */}
           <div className={`transition-all duration-700 transform ${promptStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 grayscale'} flex-shrink-0`}>
               <div className="relative">
                   <div className="absolute left-6 -top-4 w-0.5 h-4 bg-slate-300"></div>
                   <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden text-sm">
                       <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">Prompt Template</div>
                       <div className="font-mono text-slate-400 mb-2 text-xs">System:</div>
                       <p className="text-slate-200 mb-2 text-xs lg:text-sm">你是一位经验丰富的中医专家...</p>
                       <p className="text-yellow-300 bg-yellow-900/30 p-1 rounded inline-block mb-2 text-xs lg:text-sm">
                           请用JSON格式输出：{'{"证型":"", "治法":""}'}
                       </p>
                       <div className="font-mono text-slate-400 mt-2 text-xs">User:</div>
                       <p className="text-emerald-300 text-xs lg:text-sm">{symptoms}</p>
                   </div>
               </div>
           </div>

           {/* Result Extraction */}
           <div className={`transition-all duration-700 delay-200 transform ${promptStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} flex-shrink-0 pb-6`}>
               <div className="relative">
                   <div className="absolute left-6 -top-4 w-0.5 h-4 bg-slate-300"></div>
                   <div className="bg-white p-4 lg:p-6 rounded-2xl border border-emerald-200 shadow-md ring-4 ring-emerald-50/50 flex flex-col md:flex-row gap-6">
                       <div className="flex-1 min-w-0">
                           <div className="text-xs font-bold text-slate-400 uppercase mb-2">LLM Raw Output</div>
                           <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-600 font-mono whitespace-pre-wrap">
                               根据分析... <br/>
                               ```json <br/>
                               {'{'} <br/>
                               &nbsp;&nbsp;"证型": "气血两虚", <br/>
                               &nbsp;&nbsp;"治法": "补益气血" <br/>
                               {'}'} <br/>
                               ```
                           </div>
                       </div>
                       <div className="flex items-center justify-center">
                           <ArrowRight className="text-emerald-400 rotate-90 md:rotate-0" />
                       </div>
                       <div className="flex-1 min-w-0">
                           <div className="text-xs font-bold text-emerald-600 uppercase mb-2 flex items-center gap-2"><Scan size={12}/> Regex Parsed</div>
                           <div className="bg-emerald-50 p-3 rounded border border-emerald-200 text-sm text-emerald-800 font-bold shadow-inner">
                               <div className="flex justify-between border-b border-emerald-200 pb-1 mb-1">
                                   <span>证型:</span> <span>气血两虚</span>
                               </div>
                               <div className="flex justify-between">
                                   <span>治法:</span> <span>补益气血</span>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>

        </div>

        {/* Right: Code - Mobile optimized split view */}
        <div className="w-full lg:w-[450px] h-[40vh] lg:h-auto bg-slate-900 text-slate-300 p-4 lg:p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-700 flex-shrink-0 z-10 custom-scrollbar shadow-[0_-5px_15px_rgba(0,0,0,0.3)] lg:shadow-none">
            <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2 sticky top-0 bg-slate-900 py-2 border-b border-slate-800 z-20">
               <Terminal size={16} /> 源代码解析
            </h3>
            <div className="space-y-6 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {/* parse_response function */}
                <div className={`p-4 rounded-lg border transition-all duration-500 ${promptStep === 3 ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                   <div className="text-slate-500 mb-2 font-bold flex items-center gap-2"><FileJson size={12}/> 核心解析逻辑 (Regex)</div>
                   <code className="block text-yellow-200 mb-1">def parse_response(content):</code>
                   <div className="pl-4 border-l border-slate-700/50">
                       <code className="block text-slate-500 mb-1"># 1. 正则匹配 JSON 代码块</code>
                       <code className="block text-slate-500 text-[10px] italic"># pattern 解释: 寻找被 ```json 和 ``` 包裹的内容</code>
                       <code className="block text-slate-300 break-all">pattern = re.compile(r"```json\s*(.*?)\s*```", re.DOTALL)</code>
                       <code className="block text-slate-300">match = pattern.search(content)</code>
                       
                       <code className="block text-slate-500 mt-2 mb-1"># 2. 如果找到，解析 Group 1</code>
                       <code className="block text-purple-300">if match:</code>
                       <code className="block pl-4 text-emerald-300">json_str = match.group(1).strip()</code>
                       <code className="block pl-4 text-emerald-300">return json.loads(json_str)</code>
                       
                       <code className="block text-slate-500 mt-2 mb-1"># 3. 没找到则尝试解析全文</code>
                       <code className="block text-purple-300">else:</code>
                       <code className="block pl-4 text-blue-300">return json.loads(content)</code>
                   </div>
                </div>

                {/* call_large_model function */}
                <div className={`p-4 rounded-lg border transition-all duration-500 ${promptStep >= 1 && promptStep < 3 ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                   <div className="text-slate-500 mb-2 font-bold flex items-center gap-2"><MessageSquare size={12}/> API 调用封装</div>
                   <code className="block text-yellow-200 mb-1">def call_large_model(symptoms):</code>
                   <div className="pl-4 border-l border-slate-700/50">
                       <code className="block text-slate-500 mb-1"># 1. 构造 System Prompt</code>
                       <code className="block text-slate-300">system_prompt = """</code>
                       <code className="block text-slate-400 pl-4 whitespace-nowrap overflow-hidden text-ellipsis">你是一位经验丰富的中医专家...</code>
                       <code className="block text-slate-400 pl-4">请用JSON格式输出...</code>
                       <code className="block text-slate-300">"""</code>

                       <code className="block text-slate-500 mt-2 mb-1"># 2. 调用 ChatCompletions</code>
                       <code className="block text-blue-300">response = client.chat.completions.create(</code>
                       <code className="block pl-4 text-slate-300">model="ernie-4.5-0.3b",</code>
                       <code className="block pl-4 text-slate-300">messages=[...],</code>
                       <code className="block pl-4 text-purple-300">temperature=0.3,</code>
                       <code className="block pl-4 text-purple-300">max_tokens=512</code>
                       <code className="block text-blue-300">)</code>
                       
                       <code className="block text-slate-500 mt-2"># 3. 获取并解析内容</code>
                       <code className="block text-emerald-300">content = response.choices[0].message.content</code>
                       <code className="block text-emerald-300">return parse_response(content)</code>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  const renderBatch = () => (
    <div className="h-full flex flex-col animate-fade-in-up">
        <div className="p-4 lg:p-6 border-b border-emerald-100 bg-emerald-50/30 flex-shrink-0">
            <h2 className="text-xl lg:text-2xl font-bold text-emerald-900 flex items-center gap-2">
                <ListVideo className="text-emerald-600" /> 2. 批量处理 (Batch Processing)
            </h2>
            <p className="text-emerald-700 mt-2 text-xs lg:text-sm">
                Python 脚本循环读取 CSV 数据，并使用 <code className="bg-white px-1 font-mono rounded">time.sleep</code> 避免 API 限流。
            </p>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-50 min-h-0">
            <div className="flex-1 p-4 lg:p-8 overflow-y-auto flex flex-col items-center min-w-0 min-h-0">
                
                {/* Controls */}
                <div className="w-full max-w-2xl flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
                    <div>
                        <div className="font-bold text-slate-700 text-sm lg:text-base">处理队列 (Queue)</div>
                        <div className="text-xs text-slate-400">Total: {batchItems.length} items</div>
                    </div>
                    <div className="flex gap-2">
                         <button 
                            onClick={handleBatchReset}
                            className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg font-bold hover:bg-slate-200 text-xs lg:text-sm flex items-center gap-1"
                        >
                            <RotateCcw size={16}/> Reset
                        </button>
                        <button 
                            onClick={startBatchProcess}
                            disabled={batchStatus === 'running' || batchStatus === 'finished'}
                            className="bg-emerald-600 text-white px-4 lg:px-6 py-2 rounded-lg font-bold shadow hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 text-xs lg:text-sm"
                        >
                            {batchStatus === 'running' ? <Loader2 className="animate-spin"/> : <Play size={16}/>}
                            {batchStatus === 'running' ? 'Running...' : 'Start Batch'}
                        </button>
                    </div>
                </div>

                {/* Conveyor Belt Animation */}
                <div className="w-full max-w-3xl relative h-48 lg:h-64 bg-slate-200 rounded-2xl overflow-hidden border border-slate-300 shadow-inner flex items-center px-4 flex-shrink-0">
                    {/* Background Grid/Track */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(0,0,0,0.05)_50%,transparent_51%)] bg-[length:50px_100%] animate-[slide_1s_linear_infinite]"></div>
                    <style>{`@keyframes slide { from { background-position: 0 0; } to { background-position: 50px 0; } }`}</style>
                    
                    {/* Processing Zone Marker */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-24 lg:w-32 border-x-2 border-emerald-400/30 bg-emerald-100/20 z-0 flex flex-col justify-between py-2">
                         <div className="text-center text-[8px] lg:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">API Zone</div>
                         <div className="text-center text-[8px] lg:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Processing</div>
                    </div>

                    {/* Items */}
                    <div className="flex gap-4 w-full justify-center relative z-10">
                        {batchItems.map((item, i) => {
                            // Calculate visual state
                            let stateClass = "bg-white border-slate-300 text-slate-600"; // Pending
                            let scaleClass = "scale-75 lg:scale-100";
                            let positionClass = "";
                            
                            if (processedItems.includes(i)) {
                                stateClass = "bg-emerald-500 border-emerald-600 text-white opacity-0"; // Done & Hidden
                                positionClass = "translate-x-[200px]";
                            } else if (i === activeItem) {
                                stateClass = "bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-500/50 z-20"; // Active
                                scaleClass = "scale-90 lg:scale-110";
                            }

                            return (
                                <div 
                                    key={item.id}
                                    className={`w-24 lg:w-32 h-32 lg:h-40 rounded-xl border-2 flex flex-col p-2 lg:p-3 transition-all duration-500 ${stateClass} ${scaleClass} ${positionClass}`}
                                >
                                    <div className="text-[10px] opacity-70 font-mono mb-1 lg:mb-2">#{item.id}</div>
                                    <div className="text-[10px] lg:text-xs font-bold leading-tight flex-1 line-clamp-3">{item.text}</div>
                                    <div className="text-[10px] font-mono mt-1 lg:mt-2 pt-2 border-t border-white/20">
                                        {processedItems.includes(i) ? 'DONE' : (i === activeItem ? 'API...' : 'WAIT')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Status Logs */}
                <div className="w-full max-w-3xl mt-6 bg-slate-900 rounded-xl p-4 font-mono text-xs h-32 overflow-y-auto custom-scrollbar border border-slate-700 shadow-inner flex-shrink-0">
                    {batchStatus === 'idle' && <span className="text-slate-500">Waiting to start...</span>}
                    {processedItems.map(idx => (
                        <div key={idx} className="mb-1 text-emerald-400 flex items-center gap-2">
                            <Check size={10} /> [SUCCESS] Processed ID {batchItems[idx].id}. Result saved.
                        </div>
                    ))}
                    {activeItem > -1 && (
                        <div className="text-amber-400 animate-pulse flex items-center gap-2">
                            <Loader2 size={10} className="animate-spin"/> [RUNNING] Sending ID {batchItems[activeItem].id} to LLM API...
                        </div>
                    )}
                    {batchStatus === 'finished' && <div className="text-blue-400 mt-2">[COMPLETE] All tasks finished.</div>}
                </div>

            </div>

             {/* Code Panel - Fixed bottom on mobile */}
            <div className="w-full lg:w-[450px] h-[40vh] lg:h-auto bg-slate-900 text-slate-300 p-4 lg:p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-700 flex-shrink-0 z-10 custom-scrollbar shadow-[0_-5px_15px_rgba(0,0,0,0.3)] lg:shadow-none">
                <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2 sticky top-0 bg-slate-900 py-2 border-b border-slate-800 z-20">
                <Terminal size={16} /> 源代码解析
                </h3>
                <div className="space-y-6 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    <div className={`p-4 rounded border transition-colors ${activeItem > -1 ? 'bg-slate-800' : 'bg-slate-800/50 border-slate-700'}`}>
                        <div className="text-slate-500 mb-2 font-bold flex items-center gap-2"><ListVideo size={12}/> 循环处理逻辑</div>
                        <code className="block text-slate-500 mb-1"># 1. 遍历症状列表 (来自 CSV)</code>
                        <code className="block text-yellow-200">for symptom in symptoms_data:</code>
                        <div className={`pl-4 border-l border-slate-700/50 mt-1 transition-colors ${activeItem > -1 ? 'bg-blue-900/20' : ''}`}>
                            <code className="block text-blue-300"># 调用模型获取证型和治法</code>
                            <code className="block text-emerald-300">zx, zf = predict(symptom)</code>
                            <code className="block text-slate-400 mt-1"># 保存结果到列表</code>
                            <code className="block text-slate-300">predict_zx.append(zx)</code>
                            <code className="block text-slate-300">predict_zf.append(zf)</code>
                        </div>
                    </div>

                    <div className={`p-4 rounded border transition-colors ${activeItem > -1 ? 'bg-amber-900/20 border-amber-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                        <div className="flex justify-between items-center text-slate-400 mb-1 font-bold">
                            <span className="flex items-center gap-2"><Clock size={12}/> 速率限制</span>
                            {activeItem > -1 && <Clock size={12} className="text-amber-400 animate-spin"/>}
                        </div>
                        <code className="block text-amber-300 font-bold">time.sleep(0.2)</code>
                        <p className="text-[10px] text-slate-500 mt-2 leading-snug border-t border-slate-700/50 pt-2">
                            <strong>为什么要 Sleep?</strong><br/>
                            云端 API 通常有 QPS (Queries Per Second) 限制。如果不加延迟，快速的 for 循环会瞬间发送大量请求，导致 API 返回 429 Too Many Requests 错误。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderEval = () => (
    <div className="h-full flex flex-col animate-fade-in-up">
        <div className="p-4 lg:p-6 border-b border-emerald-100 bg-emerald-50/30 flex-shrink-0">
          <h2 className="text-xl lg:text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <Calculator className="text-emerald-600" /> 3. 效果评估 (Evaluation)
          </h2>
          <p className="text-emerald-700 mt-2 text-xs lg:text-sm">
             将文字转化为 <strong>Embedding (向量)</strong>，通过计算余弦相似度来给模型打分。
          </p>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-50 min-h-0">
           {/* Lab Area */}
           <div className="flex-1 p-4 lg:p-8 overflow-y-auto min-w-0 min-h-0">
               <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                   
                   {/* Tabs */}
                   <div className="flex border-b border-slate-100">
                       <button onClick={() => setEvalMode('calc')} className={`flex-1 py-3 text-xs lg:text-sm font-bold ${evalMode === 'calc' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-slate-500 hover:bg-slate-50'}`}>Cosine Similarity 计算器</button>
                       <button onClick={() => setEvalMode('space')} className={`flex-1 py-3 text-xs lg:text-sm font-bold ${evalMode === 'space' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500' : 'text-slate-500 hover:bg-slate-50'}`}>Embedding Space 可视化</button>
                   </div>

                   <div className="p-4 lg:p-8 min-h-[300px] lg:min-h-[400px]">
                       {evalMode === 'calc' ? (
                           <div className="animate-fade-in-up space-y-8">
                               <div className="flex gap-4 items-center justify-between text-xs lg:text-sm">
                                   <div className="w-1/3 text-center p-3 bg-emerald-100 rounded-lg text-emerald-800 font-bold border border-emerald-200">
                                       <div className="text-[10px] text-emerald-600 uppercase mb-1">Prediction</div>
                                       "气血两虚"
                                   </div>
                                   <div className="flex-1 border-t-2 border-slate-300 border-dashed relative h-0">
                                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-400 font-mono">
                                           VS
                                       </div>
                                   </div>
                                   <div className="w-1/3 text-center p-3 bg-blue-100 rounded-lg text-blue-800 font-bold border border-blue-200">
                                       <div className="text-[10px] text-blue-600 uppercase mb-1">Ground Truth</div>
                                       "气虚血亏"
                                   </div>
                               </div>
                               
                               <div className="flex justify-center py-4">
                                   <button 
                                     onClick={() => setSimScore(0.92)}
                                     className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 text-xs lg:text-sm"
                                   >
                                     <Play size={14}/> Run <code>cosine_similarity</code>
                                   </button>
                               </div>

                               {simScore && (
                                   <div className="text-center animate-bounce">
                                       <div className="text-5xl lg:text-6xl font-black text-slate-800">{simScore * 100}%</div>
                                       <div className="text-emerald-500 font-bold mt-2 flex items-center justify-center gap-2 text-sm">
                                           <Check size={18}/> High Semantic Similarity
                                       </div>
                                   </div>
                               )}
                           </div>
                       ) : (
                           <div className="animate-fade-in-up h-full flex flex-col items-center justify-center relative bg-slate-50 rounded-xl border border-slate-200 aspect-square lg:aspect-video">
                               <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                                   {[...Array(36)].map((_, i) => <div key={i} className="border-r border-b border-slate-100"></div>)}
                               </div>
                               
                               {/* Origin */}
                               <div className="absolute bottom-4 left-4 text-xs font-mono text-slate-400">0,0</div>

                               {/* Vectors */}
                               <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                   {/* Vector A */}
                                   <line x1="10%" y1="90%" x2="40%" y2="30%" stroke="#10b981" strokeWidth="2" markerEnd="url(#head)"/>
                                   {/* Vector B */}
                                   <line x1="10%" y1="90%" x2="45%" y2="35%" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#head)"/>
                                   
                                   {/* Angle Arc */}
                                   <path d="M 18% 74% Q 22% 72% 21% 68%" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2"/>
                                   <text x="23%" y="72%" className="text-[10px] fill-slate-500 font-bold">θ (Angle)</text>

                                   <defs>
                                       <marker id="head" orient="auto" markerWidth="4" markerHeight="4" refX="2" refY="2">
                                           <path d="M0,0 V4 L4,2 Z" fill="currentColor" className="text-slate-400"/>
                                       </marker>
                                   </defs>
                               </svg>

                               {/* Labels */}
                               <div className="absolute top-[30%] left-[40%] bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200">气血两虚</div>
                               <div className="absolute top-[35%] left-[45%] bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded border border-blue-200">气虚血亏</div>
                               
                               <div className="absolute bottom-4 right-4 bg-white p-2 rounded border border-slate-200 shadow-sm text-[10px] text-slate-500 max-w-[150px]">
                                   <strong>Embedding Space:</strong><br/>
                                   相似的词在向量空间中距离更近，夹角更小。
                               </div>
                           </div>
                       )}
                   </div>
               </div>
           </div>
           
            {/* Code Panel - Fixed bottom on mobile */}
            <div className="w-full lg:w-[450px] h-[40vh] lg:h-auto bg-slate-900 text-slate-300 p-4 lg:p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-700 flex-shrink-0 z-10 custom-scrollbar shadow-[0_-5px_15px_rgba(0,0,0,0.3)] lg:shadow-none">
                <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2 sticky top-0 bg-slate-900 py-2 border-b border-slate-800 z-20">
                <Terminal size={16} /> 源代码解析
                </h3>
                <div className="space-y-6 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                         <div className="text-slate-500 mb-2 font-bold flex items-center gap-2"><Brain size={12}/> 获取向量 (Embedding)</div>
                         <code className="block text-yellow-200 mb-1">def get_embedding(text):</code>
                         <div className="pl-4 border-l border-slate-700/50">
                             <code className="block text-slate-500 mb-1"># 1. 构造请求 Payload</code>
                             <code className="block text-blue-300 whitespace-pre">payload = json.dumps({'{'}</code>
                             <code className="block pl-4 text-purple-300">"model": "bge-large-zh",</code>
                             <code className="block pl-4 text-purple-300">"input": [text]</code>
                             <code className="block text-blue-300">{'}'})</code>
                             
                             <code className="block text-slate-500 mt-2 mb-1"># 2. 发送 POST 请求</code>
                             <code className="block text-blue-300 break-all">response = requests.post(url, headers=..., data=payload)</code>
                             <code className="block text-emerald-300">return data['data'][0]['embedding']</code>
                         </div>
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                         <div className="text-slate-500 mb-2 font-bold flex items-center gap-2"><Calculator size={12}/> 计算相似度 (Score)</div>
                         <code className="block text-yellow-200 mb-1">def score(predict_zx, predict_zf):</code>
                         <div className="pl-4 border-l border-slate-700/50">
                             <code className="block text-slate-500 mb-1"># 1. 遍历每一条预测结果</code>
                             <code className="block text-blue-300">for i in range(len(predict_zx)):</code>
                                 <code className="block pl-4 text-slate-500 text-[10px]"># 计算 "预测证型" vs "真实证型" 的相似度</code>
                                 <code className="block pl-4 text-emerald-300 break-all">sim_x = calculate_similarity(predict_zx[i], ZX[i])</code>
                                 <code className="block pl-4 text-emerald-300 break-all">sim_f = calculate_similarity(predict_zf[i], ZF[i])</code>
                                 
                                 <code className="block pl-4 text-purple-300">ZX_score.append(sim_x)</code>
                                 <code className="block pl-4 text-purple-300">ZF_score.append(sim_f)</code>
                             
                             <code className="block text-slate-500 mt-2 mb-1"># 2. 计算平均分 (百分制)</code>
                             <code className="block text-blue-300">zx_mean = np.mean(ZX_score)</code>
                             <code className="block text-blue-300">zf_mean = np.mean(ZF_score)</code>
                             <code className="block text-emerald-300">final_score = ((zx_mean + zf_mean) / 2) * 100</code>
                             <code className="block text-yellow-200">return final_score</code>
                         </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );

  // --- Main Render Switch ---
  switch (activeSubTab) {
    case 'TCM_INTRO': return renderIntro();
    case 'TCM_PROMPT': return renderPrompt();
    case 'TCM_BATCH': return renderBatch();
    case 'TCM_EVAL': return renderEval();
    default: return renderIntro();
  }
};