---
'authenticlash': patch
---

Switch avatar and victory image generation to `gpt-image-1.5`, including a temporary OpenAI SDK shim so we can call the newer model even though the typings lag.
