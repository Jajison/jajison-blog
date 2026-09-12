---
title: "深入注意力：多头、RoPE、归一化与长上下文"
description: "用维度与公式讲清 MHA/MQA/GQA、位置旋转、Pre-Norm、RMSNorm、FlashAttention 的不同职责。"
duration: 55
level: 专业进阶
prerequisites: [learn/14-transformer, guides/math-for-ai]
outcome: "区分改变模型结构、减少缓存和优化计算实现的三类技术"
tags: [Transformer, RoPE, GQA, 归一化]
---

# 深入注意力：多头、RoPE、归一化与长上下文

**这一课做成什么**：读模型技术报告时能判断一个新名词改变的是表示、缓存、计算实现，还是训练方式。

## 从单头扩展到多头

设 batch 大小 B、长度 T、隐藏维度 d、查询头数 $h_q$、单头维度 $d_h$。典型 MHA 中 $d=h_qd_h$，Q/K/V 经投影与 reshape 后形状为 $[B,h_q,T,d_h]$。每头打分得到 $[B,h_q,T,T]$，组合后拼接并经过输出投影。

固定 d 时增加头数通常只是重分配子空间维度；如果固定 $d_h$ 又增大头数，总维度及参数可能增加。讨论“更多头贵不贵”前必须说明固定的是哪个量。

## MHA、MQA、GQA 与 MLA

| 方法 | 查询头 | KV 头/表示 | 主要动机 |
| --- | --- | --- | --- |
| MHA | 多个 | 每个查询头对应独立 KV 头 | 标准多头表达 |
| MQA | 多个 | 全部共享一个 K 头、一个 V 头 | 减少 KV 缓存与带宽 |
| GQA | 多个 | 每组查询共享一对 KV 头 | 在表达与缓存间折中 |
| MLA | 多个 | 采用低秩潜在表示等专门设计 | 压缩缓存，需匹配其具体实现 |

GQA 常要求查询头数可被 KV 头数整除。K 和 V 彼此并没有变成同一个矩阵；“共享 KV”指不同查询头之间共享相应 K/V。查询头数不变时，不能声称注意力打分计算按 KV 头比例无条件下降。

MLA 不是把 KV 头数设为一个神奇数字，其低秩缓存与位置处理依赖具体架构。不能把普通 GQA 的缓存公式直接用于所有 MLA 模型。改造已训练模型通常还需继续训练，并验证质量，而不是只修改配置文件。

### 核对一次 GQA 的形状

先核对一个 GQA 形状例子：B=2、T=128、查询头=32、KV 头=8、每头维度=128。Q 是 [2,32,128,128]，K/V 各为 [2,8,128,128]。每 4 个查询头共享一组 K/V，输出仍有 32 个查询头。实现可能通过广播或专用算子读取共享缓存，不必在持久缓存里真的复制四份。检查模型代码时，先区分逻辑展开形状与实际存储形状。

## RoPE 到底旋转什么

原始 Transformer 向输入加入位置向量；RoPE 通常对注意力的 Q/K 分量做成对旋转。对位置 m 的一对分量：

$$
R(m\theta)\begin{bmatrix}x_1\\x_2\end{bmatrix}
=\begin{bmatrix}\cos(m\theta)&-\sin(m\theta)\\\sin(m\theta)&\cos(m\theta)\end{bmatrix}
\begin{bmatrix}x_1\\x_2\end{bmatrix}
$$

不同分量对使用不同频率 $\theta_i$。利用旋转矩阵性质：

$$
\big(R(m\theta)q\big)^T\big(R(n\theta)k\big)=q^TR((n-m)\theta)k
$$

点积因此含有相对距离 $n-m$ 的信息。旋转保持向量范数，但位置变化会改变不同向量的匹配。它不是“直接给每个字贴上行号”，也不能自动保证无限长度外推。

其他选择包括可学习绝对位置、正弦位置、相对位置偏置、ALiBi 等。不同方法改变位置进入计算的方式，不能因为都服务于顺序信息就混用公式。

### 手算一个二维旋转

用一个二维例子检查旋转：q=k=[1,0]，频率取**教学值** $\theta=\pi/2$。位置相同，旋转后点积为 1；位置相差 1，方向相差 90 度，点积为 0；相差 2，点积为 -1。真实模型使用许多频率和更多维度，这个单频例子只解释相对位置怎样进入点积。

## 长上下文不是只改一个上限

超过训练长度后，位置尺度、数据分布、检索能力和数值行为可能改变。RoPE scaling、位置插值、YaRN 等方案各有前提，通常还涉及训练或评估；把配置上限改成 100 万不等于模型已经学会稳定使用百万 token。

长上下文评估应覆盖多个位置、多个相关事实、冲突、干扰与多跳问题。单个 needle-in-a-haystack 题成功，只证明这一类提取任务，不证明完整长文推理可靠。

## LayerNorm 与 RMSNorm

对单个位置的 d 维特征，LayerNorm 典型形式是：

$$
\operatorname{LN}(x)_i=\gamma_i\frac{x_i-\mu}{\sqrt{\sigma^2+\epsilon}}+\beta_i
$$

其中均值和方差沿特征维计算；$\gamma$、$\beta$ 可学习，$\epsilon$ 避免除零。RMSNorm 使用均方根缩放，通常不减均值：

$$
\operatorname{RMSNorm}(x)_i=\gamma_i\frac{x_i}{\sqrt{\frac1d\sum_jx_j^2+\epsilon}}
$$

Pre-Norm 与 Post-Norm 讨论归一化放在子层之前还是残差相加之后；LayerNorm 与 RMSNorm 讨论归一化方式。两组概念属于不同轴，可以组合。Pre-Norm 常有训练稳定性优势，但不应将经验总结写成对所有深度和训练设置的保证。

## FlashAttention 不是近似稀疏注意力

朴素实现会把大型注意力中间矩阵写到显存；FlashAttention 通过分块、融合和在线 softmax 减少 IO，计算数学上等价的密集注意力（仍有浮点数差异）。它不靠随意丢掉“低注意力”项实现主要收益。

PagedAttention 主要涉及 KV Cache 的分页管理与共享，解决碎片和调度效率；KV Cache 是增量解码复用历史表示；三者能协同，但不是同一技术的三个名字。

## 动手核算

在 [实验室](../labs.md) 比较 32 个查询头下 32、8、1 个 KV 头的缓存大小，再把序列长度翻倍。先写出变化倍数，再查看结果。注意这里计算的是标准 MHA/GQA/MQA 缓存，不是总显存。

**完成标准**：能对“GQA 降低缓存”“RoPE 引入位置”“RMSNorm 缩放特征”“FlashAttention 优化 IO”分别给出计算层面的解释。

<details>
<summary>自测：FlashAttention 让显存更省，所以密集注意力的计算复杂度变成线性了吗？</summary>

不是。它避免显式存储完整的大型中间矩阵，减少内存访问；标准密集注意力的成对计算仍是序列长度的二次关系。存储复杂度、计算复杂度与实测时间应分别讨论。

</details>

参考：[RoFormer / RoPE](https://arxiv.org/abs/2104.09864)、[GQA](https://arxiv.org/abs/2305.13245)、[RMSNorm](https://arxiv.org/abs/1910.07467)、[FlashAttention](https://arxiv.org/abs/2205.14135)、[YaRN](https://arxiv.org/abs/2309.00071)。
