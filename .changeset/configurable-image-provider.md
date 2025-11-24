---
"authenticlash": minor
---

Add configurable image generation provider with environment variable control. Switches default from Fal AI back to OpenAI gpt-image-1 while keeping both providers available. Set IMAGE_GENERATOR=openai (default) or IMAGE_GENERATOR=fal to switch between providers without code changes.
