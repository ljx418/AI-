---
name: debugging-patterns
description: 调试经验总结 - 实时语音识别系统常见问题
type: feedback
---

# 调试经验总结

## 实时语音识别系统调试

### 排查步骤

1. **检查服务健康**
   ```bash
   curl http://localhost:8001/health  # FunASR
   curl http://localhost:8000/api/v1/health  # Backend
   ```

2. **直接测试 API**
   ```python
   # 测试 FunASR /recognize 端点
   import aiohttp
   from io import BytesIO
   import wave

   # 生成测试音频
   pcm_data = b'\x00' * 16000 * 2  # 1秒静音
   # ... 转换为 WAV ...

   async def test():
       form = aiohttp.FormData()
       form.add_field('file', BytesIO(wav_data), filename='test.wav')
       async with aiohttp.ClientSession() as s:
           r = await s.post('http://localhost:8001/recognize', data=form)
           print(await r.text())
   ```

3. **检查日志**
   - Backend: 在 `transcriber.py`, `funasr_streamer.py` 添加 debug 日志
   - Frontend: Chrome DevTools Console

### 常见问题

| 问题 | 可能原因 | 排查方法 |
|------|----------|----------|
| 实时转写无输出 | `_running=False` 丢弃音频 | 检查 `process_audio` 日志 |
| 提交延迟过高 | `SILENCE_TIMEOUT` 设置过大 | 检查 commit 日志 |
| FunASR 无响应 | 服务未启动或 API 格式错误 | 直接 POST 测试 |

### 日志添加位置

```python
# transcriber.py - process_audio
logger.debug(f"process_audio: {len(audio_data)} bytes, buffer={buffer_duration:.2f}s")

# transcriber.py - commit
logger.debug(f"commit check: running={self._running}, buffer={buffer_duration:.2f}s")

# funasr_streamer.py - recognize_chunk
logger.info(f"Recognizing chunk: {len(audio_data)} bytes, time=[{start_time:.1f}s, {end_time:.1f}s]")
```

### 修复验证

1. 重启后端: `kill <pid> && python3 -m uvicorn ...`
2. 观察日志输出
3. 测试录音功能
4. 检查转写结果是否实时显示

## 为什么: 调试期间添加日志，完成后移除或降级

**Why:** Verbose logging helps trace execution flow during debugging, but in production it creates noise and performance overhead. After fixing an issue, either remove debug logs entirely or convert them to appropriate levels (INFO for significant events, DEBUG for detailed traces).

**How to apply:** When debugging is complete, either delete debug statements or change `logger.debug()` to appropriate levels. Keep `logger.info()` for important milestones.
