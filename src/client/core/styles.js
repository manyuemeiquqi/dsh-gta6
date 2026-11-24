export function installStyles(pluginId, chunks) {
  const sheet = document.createElement('style')
  sheet.dataset.plugin = pluginId
  sheet.textContent = chunks.filter(Boolean).join('\n')
  document.head.appendChild(sheet)
  return () => sheet.remove()
}
