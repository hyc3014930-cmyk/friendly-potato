import React, { useState } from 'react';
import { Image as ImageIcon, Layers, Cpu, ArrowRight, Settings, Box, BarChart3, ScanLine, Terminal, BookOpen, Trash2, Zap, Search, Loader2, Database, History, RefreshCw, Grid, Minimize, Scaling } from 'lucide-react';

export const VisionView: React.FC<{ activeSubTab: string }> = ({ activeSubTab }) => {
  const [pipelineStep, setPipelineStep] = useState(0); 
  const [lrType, setLrType] = useState<'cosine' | 'square' | 'constant'>('cosine');
  const [inferState, setInferState] = useState(0);
  const [archLabMode, setArchLabMode] = useState<'struct' | 'conv' | 'pool'>('struct'); // Lab modes

  // --- Math Lab State ---
  const [convPos, setConvPos] = useState({ r: 0, c: 0 });
  const [poolPos, setPoolPos] = useState({ r: 0, c: 0 });

  // --- Data & Helpers ---
  const pipelineSteps = [
    { name: "Original", desc: "RGB Image", shape: "(H, W, 3)", color: "bg-slate-200" },
    { name: "Resize", desc: "Bilinear", shape: "(224, 224, 3)", color: "bg-blue-200" },
    { name: "Normalize", desc: "(x - mean) / std", shape: "(224, 224, 3)", color: "bg-purple-200" },
    { name: "Transpose", desc: "HWC -> CHW", shape: "(3, 224, 224)", color: "bg-emerald-200" },
  ];

  const garbageClasses = [
     { id: '00_01', name: 'Hats (帽子)', imgColor: 'bg-amber-200' },
     { id: '00_03', name: 'Cans (易拉罐)', imgColor: 'bg-slate-300' },
     { id: '01_02', name: 'Broom (扫把)', imgColor: 'bg-orange-200' },
     { id: '03_03', name: 'Banana (香蕉皮)', imgColor: 'bg-yellow-200' },
  ];

  const generateLrPoints = () => {
      const points = [];
      const steps = 50;
      for(let i=0; i<=steps; i++) {
          let y = 0;
          const x = i/steps; 
          if(lrType === 'constant') y = 0.8;
          if(lrType === 'square') y = 0.8 * Math.pow((1-x), 2);
          if(lrType === 'cosine') y = 0.8 * 0.5 * (1 + Math.cos(Math.PI * x));
          points.push(`${i * (300/steps)},${100 - (y * 100)}`); 
      }
      return points.join(' ');
  };

  // --- Render Functions ---

  const renderIntro = () => (
    <div className="h-full flex flex-col animate-fade-in-up">
        <div className="p-4 lg:p-6 border-b border-cyan-100 bg-cyan-50/30 flex-shrink-0">
        <h2 className="text-xl lg:text-2xl font-bold text-cyan-900 flex items-center gap-2">
            <BookOpen className="text-cyan-600" /> 0. 项目背景 (Background)
        </h2>
        <p className="text-cyan-700 mt-2 text-xs lg:text-sm">
            从深度学习的 Hello World (LeNet5) 到工业级垃圾分类 (MobileNetV2)。
        </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50 min-h-0">
            <div className="max-w-4xl mx-auto space-y-8 pb-10">
                {/* Cards reused from previous logic but cleaned up */}
                <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                        <History size={20} className="text-blue-500" /> 深度学习演进
                    </h3>
                    <div className="flex flex-col md:flex-row gap-8 items-stretch">
                        <div className="flex-1 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col items-center text-center">
                            <div className="text-3xl mb-3">🔢</div>
                            <h4 className="font-bold text-slate-700">LeNet5</h4>
                            <p className="text-xs text-slate-500 mt-2">MNIST 手写数字识别 (28x28)</p>
                        </div>
                        <ArrowRight className="text-slate-300 self-center rotate-90 md:rotate-0" />
                        <div className="flex-1 bg-cyan-50 p-5 rounded-xl border border-cyan-200 flex flex-col items-center text-center ring-2 ring-cyan-200">
                            <div className="text-3xl mb-3">♻️</div>
                            <h4 className="font-bold text-slate-700">MobileNetV2</h4>
                            <p className="text-xs text-slate-500 mt-2">垃圾分类 (224x224)</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Trash2 size={20} className="text-emerald-500" /> 任务：26类垃圾分类
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {garbageClasses.map(c => (
                            <div key={c.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                                <div className={`w-8 h-8 rounded ${c.imgColor}`}></div>
                                <div className="text-xs font-bold text-slate-600">{c.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderPipeline = () => (
    <div className="h-full flex flex-col animate-fade-in-up">
      <div className="p-4 lg:p-6 border-b border-cyan-100 bg-cyan-50/30 flex-shrink-0">
        <h2 className="text-xl lg:text-2xl font-bold text-cyan-900 flex items-center gap-2">
          <ImageIcon className="text-cyan-600" /> 1. 图像数据流水线 (Data Pipeline)
        </h2>
        <p className="text-cyan-700 mt-2 text-xs lg:text-sm">
           深度学习模型无法直接“看”图片。我们需要将 JPG 图片转化为模型能理解的数学张量 (Tensor)。
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-50 min-h-0">
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto flex flex-col items-center justify-start gap-8 min-w-0 min-h-0">
            {/* Steps */}
            <div className="flex items-center gap-2 w-full max-w-3xl justify-between overflow-x-auto pb-4 no-scrollbar flex-shrink-0">
                {pipelineSteps.map((s, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => setPipelineStep(idx)}
                        className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 flex-shrink-0 px-2 ${pipelineStep === idx ? 'scale-110 opacity-100' : 'opacity-50 hover:opacity-80'}`}
                    >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm border-2 ${pipelineStep === idx ? 'border-cyan-500' : 'border-transparent'} ${s.color}`}>
                            <span className="text-lg font-bold text-slate-700">{idx + 1}</span>
                        </div>
                        <div className="text-center">
                            <div className="text-xs font-bold text-slate-700 whitespace-nowrap">{s.name}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual */}
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-slate-200 min-h-[250px] lg:min-h-[300px] flex flex-col items-center justify-center relative perspective-1000 flex-shrink-0">
                 {pipelineStep === 0 && (
                     <div className="animate-fade-in-up text-center">
                         <div className="w-32 h-32 lg:w-48 lg:h-48 bg-slate-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-slate-300">
                             <ImageIcon size={64} className="text-slate-400" />
                         </div>
                         <div className="font-bold text-slate-700">Raw Image</div>
                         <div className="text-xs text-slate-500 font-mono mt-1">Shape: Variable (H, W, 3)</div>
                     </div>
                 )}
                 {pipelineStep === 1 && (
                     <div className="animate-fade-in-up text-center">
                         <div className="w-32 h-32 lg:w-48 lg:h-48 bg-blue-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-blue-300 relative">
                             <Scaling size={48} className="text-blue-500 absolute" />
                             <div className="absolute bottom-2 right-2 text-[10px] bg-white px-1 rounded border border-blue-200">224x224</div>
                         </div>
                         <div className="font-bold text-slate-700">Resize</div>
                         <div className="text-xs text-slate-500 font-mono mt-1">Bilinear Interpolation</div>
                     </div>
                 )}
                 {pipelineStep === 2 && (
                     <div className="animate-fade-in-up text-center">
                         <div className="w-32 h-32 lg:w-48 lg:h-48 bg-purple-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-purple-300 relative">
                             <div className="grid grid-cols-4 grid-rows-4 w-24 h-24 lg:w-32 lg:h-32 gap-1">
                                 {[...Array(16)].map((_,i) => (
                                     <div key={i} className="bg-purple-300/50 rounded-sm"></div>
                                 ))}
                             </div>
                         </div>
                         <div className="font-bold text-slate-700">Normalize</div>
                         <div className="text-xs text-slate-500 font-mono mt-1">Values: [-1, 1]</div>
                     </div>
                 )}
                 {pipelineStep === 3 && (
                     <div className="animate-fade-in-up text-center transform-style-3d animate-[spinY_3s_ease-in-out_infinite]">
                         <style>{`@keyframes spinY { 0% { transform: rotateY(0deg); } 50% { transform: rotateY(180deg); } 100% { transform: rotateY(360deg); } }`}</style>
                         <div className="flex gap-2 justify-center mb-4">
                             <div className="w-16 h-20 lg:w-20 lg:h-24 bg-red-100 border border-red-300 rounded flex items-center justify-center text-red-500 font-bold shadow-md transform translate-z-10">R</div>
                             <div className="w-16 h-20 lg:w-20 lg:h-24 bg-green-100 border border-green-300 rounded flex items-center justify-center text-green-500 font-bold shadow-md transform -translate-x-4 translate-y-2 -translate-z-10">G</div>
                             <div className="w-16 h-20 lg:w-20 lg:h-24 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-blue-500 font-bold shadow-md transform -translate-x-8 translate-y-4 -translate-z-20">B</div>
                         </div>
                         <div className="font-bold text-emerald-700">Transpose (CHW)</div>
                     </div>
                 )}
            </div>
        </div>

        {/* Code Panel - Fixed bottom on mobile */}
        <div className="w-full lg:w-[450px] h-[40vh] lg:h-auto bg-slate-900 text-slate-300 p-4 lg:p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-700 flex-shrink-0 z-10 custom-scrollbar shadow-[0_-5px_15px_rgba(0,0,0,0.3)] lg:shadow-none">
            <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2 sticky top-0 bg-slate-900 py-2 border-b border-slate-800 z-20">
               <Terminal size={16} /> 源代码解析
            </h3>
            <div className="space-y-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                <code className="block text-yellow-200">def image_process(image):</code>
                
                <div className={`p-3 rounded transition-colors ${pipelineStep === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                    <code className="block text-slate-500 mb-1"># 0. 确保使用 RGB 格式</code>
                    <code className="block text-blue-300">img = Image.fromarray(image).convert('RGB')</code>
                </div>

                <div className={`p-3 rounded transition-colors ${pipelineStep === 1 ? 'bg-blue-900/40 border-l-2 border-blue-400' : 'bg-slate-800/50'}`}>
                    <code className="block text-slate-500 mb-1"># 1. 调整大小 (Resize)</code>
                    <code className="block text-blue-300">img = img.resize((224, 224), Image.BILINEAR)</code>
                </div>
                
                <div className={`p-3 rounded transition-colors ${pipelineStep === 2 ? 'bg-purple-900/40 border-l-2 border-purple-400' : 'bg-slate-800/50'}`}>
                    <code className="block text-slate-500 mb-1"># 2. 归一化 (Normalize)</code>
                    <code className="block text-slate-400"># 转为 numpy 并缩放到 [0,1]</code>
                    <code className="block text-purple-300">img = np.array(img).astype(np.float32) / 255.0</code>
                    <code className="block text-slate-400 mt-1"># 减去均值除以方差</code>
                    <code className="block text-purple-300">img = (img - mean) / std</code>
                </div>
                
                <div className={`p-3 rounded transition-colors ${pipelineStep === 3 ? 'bg-emerald-900/40 border-l-2 border-emerald-400' : 'bg-slate-800/50'}`}>
                    <code className="block text-slate-500 mb-1"># 3. 维度变换 (HWC -> CHW)</code>
                    <code className="block text-emerald-300">img = img.transpose(2, 0, 1)</code>
                    <code className="block text-slate-400 mt-1"># MindSpore 需要 Channel First 格式</code>
                    <code className="block text-emerald-300">return Tensor(img[None, ...], ms.float32)</code>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  const renderArch = () => (
    <div className="h-full flex flex-col animate-fade-in-up">
       <div className="p-4 lg:p-6 border-b border-cyan-100 bg-cyan-50/30 flex-shrink-0">
        <h2 className="text-xl lg:text-2xl font-bold text-cyan-900 flex items-center gap-2">
            <Layers className="text-cyan-600" /> 2. MobileNetV2 架构 (Architecture)
        </h2>
        <p className="text-cyan-700 mt-2 text-xs lg:text-sm">
            骨干网络负责提取特征，分类头负责输出结果。点击 <strong className="bg-white px-1 rounded">Labs</strong> 了解卷积原理。
        </p>
       </div>

       <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-50 min-h-0">
           {/* Visual Area */}
           <div className="flex-1 p-4 lg:p-8 overflow-y-auto min-w-0 min-h-0">
               <div className="max-w-4xl mx-auto flex flex-col gap-6">
                   
                   {/* Toggle Labs */}
                   <div className="flex border-b border-slate-200 mb-4 overflow-x-auto">
                       <button onClick={() => setArchLabMode('struct')} className={`px-4 py-2 text-sm font-bold border-b-2 flex-shrink-0 ${archLabMode==='struct' ? 'border-cyan-500 text-cyan-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>系统架构</button>
                       <button onClick={() => setArchLabMode('conv')} className={`px-4 py-2 text-sm font-bold border-b-2 flex-shrink-0 ${archLabMode==='conv' ? 'border-purple-500 text-purple-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>卷积实验 (Conv)</button>
                       <button onClick={() => setArchLabMode('pool')} className={`px-4 py-2 text-sm font-bold border-b-2 flex-shrink-0 ${archLabMode==='pool' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>池化实验 (Pool)</button>
                   </div>

                   {archLabMode === 'struct' && (
                       <div className="animate-fade-in-up space-y-4">
                           {/* Backbone */}
                           <div className="bg-slate-200 p-6 rounded-xl border border-slate-300 flex items-center gap-6 opacity-80 relative">
                               <div className="absolute top-2 right-2 text-[10px] font-bold bg-slate-400 text-white px-2 py-1 rounded">Frozen</div>
                               <Cpu size={32} className="text-slate-500" />
                               <div className="flex-1">
                                   <h3 className="text-lg font-bold text-slate-700">MobileNetV2 Backbone</h3>
                                   <p className="text-xs text-slate-500">ImageNet Pre-trained. Feature Extractor.</p>
                                   <div className="mt-2 text-[10px] text-slate-500 font-mono bg-slate-100 inline-block px-2 py-1 rounded">
                                       param.requires_grad = False
                                   </div>
                               </div>
                           </div>
                           <div className="flex justify-center"><ArrowRight className="text-slate-300 rotate-90 lg:rotate-0"/></div>
                           {/* Head */}
                           <div className="bg-white p-6 rounded-xl border-2 border-rose-200 shadow-lg flex items-center gap-6 relative">
                               <div className="absolute top-2 right-2 text-[10px] font-bold bg-rose-500 text-white px-2 py-1 rounded animate-pulse">Trainable</div>
                               <ScanLine size={32} className="text-rose-500" />
                               <div className="flex-1">
                                   <h3 className="text-lg font-bold text-slate-800">Classification Head</h3>
                                   <p className="text-xs text-slate-500">Global Pooling + Dense(26) + Softmax</p>
                                   <div className="mt-2 text-[10px] text-rose-500 font-mono bg-rose-50 inline-block px-2 py-1 rounded border border-rose-100">
                                       Optimizer updates these weights
                                   </div>
                               </div>
                           </div>
                       </div>
                   )}

                   {archLabMode === 'conv' && (
                       <div className="animate-fade-in-up bg-white p-6 rounded-xl border border-purple-200 shadow-sm">
                           <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2"><Grid size={18}/> 卷积原理 (Convolution)</h3>
                           <p className="text-xs text-slate-500 mb-6">卷积核在图像上滑动，提取局部特征。点击下方网格移动卷积核。</p>
                           
                           <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
                               {/* Input Grid 5x5 */}
                               <div className="grid grid-cols-5 gap-1">
                                   {[...Array(25)].map((_, i) => {
                                       const r = Math.floor(i/5), c = i%5;
                                       const isCovered = r >= convPos.r && r < convPos.r+3 && c >= convPos.c && c < convPos.c+3;
                                       return (
                                           <div 
                                             key={i} 
                                             className={`w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center text-[10px] border ${isCovered ? 'bg-purple-100 border-purple-500' : 'bg-slate-50 border-slate-100'}`}
                                           >
                                               {Math.floor(Math.random()*9)}
                                           </div>
                                       );
                                   })}
                               </div>
                               <ArrowRight className="rotate-90 lg:rotate-0"/>
                               {/* Output Grid 3x3 */}
                               <div className="grid grid-cols-3 gap-1">
                                   {[...Array(9)].map((_, i) => {
                                        const r = Math.floor(i/3), c = i%3;
                                        const isActive = r === convPos.r && c === convPos.c;
                                        return (
                                           <div 
                                             key={i} 
                                             onMouseEnter={() => setConvPos({r, c})}
                                             className={`w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center text-[10px] border cursor-pointer transition-colors ${isActive ? 'bg-purple-600 text-white font-bold' : 'bg-slate-50 border-slate-200'}`}
                                           >
                                               ?
                                           </div>
                                        );
                                   })}
                               </div>
                           </div>
                       </div>
                   )}

                    {archLabMode === 'pool' && (
                       <div className="animate-fade-in-up bg-white p-6 rounded-xl border border-emerald-200 shadow-sm">
                           <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><Minimize size={18}/> 池化原理 (Max Pooling)</h3>
                           <p className="text-xs text-slate-500 mb-6">保留区域内最大值，压缩图像尺寸。</p>
                           
                           <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
                               {/* Input Grid 4x4 */}
                               <div className="grid grid-cols-4 gap-1">
                                   {[...Array(16)].map((_, i) => {
                                       const r = Math.floor(i/4), c = i%4;
                                       // Check if in current 2x2 block based on poolPos (which is 0 or 1 for output)
                                       // Output (0,0) -> Input rows 0,1 cols 0,1
                                       const targetRStart = poolPos.r * 2;
                                       const targetCStart = poolPos.c * 2;
                                       const isCovered = r >= targetRStart && r < targetRStart+2 && c >= targetCStart && c < targetCStart+2;
                                       return (
                                           <div 
                                             key={i} 
                                             className={`w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center text-[10px] border ${isCovered ? 'bg-emerald-100 border-emerald-500' : 'bg-slate-50 border-slate-100'}`}
                                           >
                                               {Math.floor(Math.random()*9)}
                                           </div>
                                       );
                                   })}
                               </div>
                               <ArrowRight className="rotate-90 lg:rotate-0"/>
                               {/* Output Grid 2x2 */}
                               <div className="grid grid-cols-2 gap-1">
                                   {[...Array(4)].map((_, i) => {
                                        const r = Math.floor(i/2), c = i%2;
                                        const isActive = r === poolPos.r && c === poolPos.c;
                                        return (
                                           <div 
                                             key={i} 
                                             onMouseEnter={() => setPoolPos({r, c})}
                                             className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-xs border cursor-pointer transition-colors ${isActive ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-50 border-slate-200'}`}
                                           >
                                               Max
                                           </div>
                                        );
                                   })}
                               </div>
                           </div>
                       </div>
                   )}

               </div>
           </div>

            {/* Code Panel - Fixed bottom on mobile */}
            <div className="w-full lg:w-[450px] h-[40vh] lg:h-auto bg-slate-900 text-slate-300 p-4 lg:p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-700 flex-shrink-0 z-10 custom-scrollbar shadow-[0_-5px_15px_rgba(0,0,0,0.3)] lg:shadow-none">
                <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2 sticky top-0 bg-slate-900 py-2 border-b border-slate-800 z-20">
                <Terminal size={16} /> 核心代码：MobileNetV2Head
                </h3>
                <div className="space-y-6 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                        <code className="block text-yellow-200">class MobileNetV2Head(nn.Cell):</code>
                        <div className="pl-4">
                            <code className="block text-slate-400 mb-1"># __init__: 定义网络层</code>
                            <code className="block text-purple-300"># Global Avg Pooling: (1280, 7, 7) -> (1280)</code>
                            <code className="block text-blue-300">self.flatten = GlobalPooling(reduction='mean')</code>
                            
                            <code className="block text-purple-300 mt-2"># Dense: 全连接层，输出26个分类</code>
                            <code className="block text-blue-300">self.dense = nn.Dense(1280, 26, weight_init='ones')</code>
                            
                            <code className="block text-purple-300 mt-2"># Activation: Softmax 归一化</code>
                            <code className="block text-emerald-300">self.activation = nn.Softmax()</code>
                        </div>
                        <div className="pl-4 mt-4 border-t border-slate-700 pt-2">
                            <code className="block text-slate-400 mb-1"># construct: 前向传播逻辑</code>
                            <code className="block text-slate-200">def construct(self, x):</code>
                            <code className="block pl-4 text-slate-300"># 1. 展平 (Pooling)</code>
                            <code className="block pl-4 text-slate-300">x = self.flatten(x)</code>
                            <code className="block pl-4 text-slate-300"># 2. 映射 (Dense)</code>
                            <code className="block pl-4 text-slate-300">x = self.dense(x)</code>
                            <code className="block pl-4 text-slate-300"># 3. 概率 (Softmax)</code>
                            <code className="block pl-4 text-emerald-300">return self.activation(x)</code>
                        </div>
                    </div>
                </div>
            </div>
       </div>
    </div>
  );

  const renderTrain = () => (
    <div className="h-full flex flex-col animate-fade-in-up">
       <div className="p-4 lg:p-6 border-b border-cyan-100 bg-cyan-50/30 flex-shrink-0">
            <h2 className="text-xl lg:text-2xl font-bold text-cyan-900 flex items-center gap-2">
                <Zap className="text-cyan-600" /> 3. 迁移训练 & 学习率
            </h2>
            <p className="text-cyan-700 mt-2 text-xs lg:text-sm">MindSpore 训练策略。</p>
       </div>
       <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-50 min-h-0">
            <div className="flex-1 p-4 lg:p-8 overflow-y-auto min-w-0 min-h-0">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-700">LR Scheduler</h3>
                            <div className="flex bg-slate-100 rounded-lg p-1 text-xs">
                                <button onClick={() => setLrType('cosine')} className={`px-3 py-1 rounded ${lrType==='cosine' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-500'}`}>Cosine</button>
                                <button onClick={() => setLrType('square')} className={`px-3 py-1 rounded ${lrType==='square' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-500'}`}>Square</button>
                            </div>
                        </div>
                        <div className="h-48 w-full bg-slate-50 rounded border border-slate-100 relative flex items-center justify-center">
                            <svg className="w-full h-full max-w-[400px] overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                                <polyline points={generateLrPoints()} fill="none" stroke="#0891b2" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
                            </svg>
                        </div>
                    </div>
            </div>
            {/* Code Panel - Fixed bottom on mobile */}
            <div className="w-full lg:w-[450px] h-[40vh] lg:h-auto bg-slate-900 text-slate-300 p-4 lg:p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-700 flex-shrink-0 z-10 custom-scrollbar shadow-[0_-5px_15px_rgba(0,0,0,0.3)] lg:shadow-none">
                 <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2 sticky top-0 bg-slate-900 py-2 border-b border-slate-800 z-20"><Terminal size={16}/> 核心代码</h3>
                 <div className="font-mono text-xs leading-relaxed space-y-4 whitespace-pre-wrap">
                    <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                        <code className="block text-yellow-200 mb-1">def build_lr(...):</code>
                        <div className="pl-4 border-l border-slate-700/50">
                            <code className="block text-slate-400"># 计算余弦退火学习率</code>
                            <code className="block text-blue-300">if decay_type == 'cosine':</code>
                            <code className="block pl-4 text-purple-300 whitespace-pre">cosine_decay = 0.5 * (1 + cos(...))</code>
                            <code className="block pl-4 text-emerald-300 whitespace-pre">lr = (max - end) * cosine_decay + end</code>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                        <code className="block text-yellow-200 mb-1"># 冻结骨干网络</code>
                        <div className="pl-4 border-l border-slate-700/50">
                            <code className="block text-blue-300">backbone = MobileNetV2Backbone()</code>
                            <code className="block text-purple-300">for param in backbone.get_parameters():</code>
                            <code className="block pl-4 text-emerald-300">param.requires_grad = False</code>
                        </div>
                    </div>
                 </div>
            </div>
       </div>
    </div>
  );

  const renderInference = () => (
    <div className="h-full flex flex-col animate-fade-in-up">
       <div className="p-4 lg:p-6 border-b border-cyan-100 bg-cyan-50/30 flex-shrink-0">
            <h2 className="text-xl lg:text-2xl font-bold text-cyan-900 flex items-center gap-2">
                <Search className="text-cyan-600" /> 4. 预测推理 (Inference)
            </h2>
       </div>
       <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-50 min-h-0">
           <div className="flex-1 p-4 lg:p-8 overflow-y-auto flex flex-col items-center min-w-0 min-h-0">
               <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-2xl flex flex-col items-center gap-8">
                   <div className="flex items-center gap-2 lg:gap-4 w-full justify-between">
                       {/* Input */}
                       <div className="flex flex-col items-center">
                           <div className="w-16 h-16 lg:w-20 lg:h-20 bg-amber-100 rounded-lg flex items-center justify-center text-3xl border border-amber-200 relative">
                               🧢
                           </div>
                           <div className="text-xs font-bold mt-2 text-slate-500">Input</div>
                       </div>
                       <ArrowRight className={`transition-all ${inferState > 0 ? 'text-blue-500' : 'text-slate-300'}`}/>
                       
                       {/* Model */}
                       <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-slate-100 rounded-lg flex items-center justify-center border transition-all ${inferState===1 ? 'border-blue-500 shadow-lg' : 'border-slate-200'}`}>
                           {inferState===1 ? <Loader2 className="animate-spin text-blue-500"/> : <Cpu className="text-slate-400"/>}
                       </div>
                       <ArrowRight className={`transition-all ${inferState > 1 ? 'text-blue-500' : 'text-slate-300'}`}/>

                       {/* Result */}
                       <div className={`w-20 h-16 lg:w-24 lg:h-20 bg-slate-100 rounded-lg flex items-center justify-center border transition-all ${inferState===2 ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
                           {inferState===2 ? <span className="text-emerald-600 font-bold text-sm lg:text-base">Hats</span> : <span className="text-slate-300 text-xs">...</span>}
                       </div>
                   </div>

                   <button 
                     onClick={() => { setInferState(1); setTimeout(() => setInferState(2), 1500); }}
                     className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-bold shadow-lg hover:bg-cyan-700 text-sm lg:text-base"
                   >
                       Start Predict
                   </button>
               </div>
           </div>
           
           {/* Code Panel - Fixed bottom on mobile */}
           <div className="w-full lg:w-[450px] h-[40vh] lg:h-auto bg-slate-900 text-slate-300 p-4 lg:p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-700 flex-shrink-0 z-10 custom-scrollbar shadow-[0_-5px_15px_rgba(0,0,0,0.3)] lg:shadow-none">
               <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2 sticky top-0 bg-slate-900 py-2 border-b border-slate-800 z-20"><Terminal size={16}/> 核心代码</h3>
               <div className="font-mono text-xs space-y-4 whitespace-pre-wrap">
                   <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                        <code className="block text-yellow-200 mb-1">def infer_one(network, path):</code>
                        <div className="pl-4 border-l border-slate-700/50">
                            <code className="block text-slate-400"># 1. 预处理</code>
                            <code className="block text-blue-300">image = Image.open(path)</code>
                            <code className="block text-blue-300">tensor = image_process(image)</code>
                            
                            <code className="block text-slate-400 mt-2"># 2. 推理计算</code>
                            <code className="block text-purple-300">logits = network(tensor)</code>
                            
                            <code className="block text-slate-400 mt-2"># 3. Argmax 取最大概率</code>
                            <code className="block text-emerald-300">pred = np.argmax(logits.asnumpy())</code>
                            <code className="block text-emerald-300">return inverted[pred]</code>
                        </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );

  switch (activeSubTab) {
    case 'CV_INTRO': return renderIntro();
    case 'CV_PIPELINE': return renderPipeline();
    case 'CV_ARCH': return renderArch();
    case 'CV_TRAIN': return renderTrain();
    case 'CV_INFERENCE': return renderInference();
    default: return renderIntro();
  }
};