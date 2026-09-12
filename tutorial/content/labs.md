---
title: "原理实验室：让公式变成可以验证的计算"
description: "在浏览器里探索 softmax 与温度、注意力与因果掩码、KV Cache 容量。列明输入、公式、单位和适用边界。"
duration: 35
tags: [实验室, Transformer, 数学, 推理]
---

# 原理实验室

先预测，再调整，最后用数字解释发生了什么。三个实验都在当前浏览器本地计算，不需要安装 Python、下载模型或申请 API。

**需要的基础**：知道向量是一列数即可开始；公式中的求和、指数与矩阵可参考[数学起点](guides/math-for-ai.md)。注意力的完整背景见 [Transformer](learn/14-transformer.md)，缓存结构见[推理与部署](guides/inference-and-deployment.md)。

**怎样使用**：每次只改一个参数，记录“改了什么 → 预期怎样变化 → 实际结果”。这些小实验使用明确设定的数值，帮助理解机制；不能代替真实模型质量或性能测试。

参考：[原始 Transformer 论文](https://arxiv.org/abs/1706.03762)、[Hugging Face 缓存原理](https://huggingface.co/docs/transformers/cache_explanation)、[缓存策略](https://huggingface.co/docs/transformers/kv_cache)。实现采用常规注意力和稠密缓存假设，特殊模型结构请回到其模型文档确认。
