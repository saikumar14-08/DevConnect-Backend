# Express does NOT stop at a partially matched route. It finds the best match.
# Order matters only when using app.use(), or when two similar routes conflict in logic.
# Always define more specific routes (/hello/hi) before generic routes (/hello) when needed.