function showHelp(): void {
  console.log(`
    Использование:
    node tasks.js add "описание"
    node tasks.js list
    node tasks.js done <id>
    node tasks.js delete <id>
        `)
}

export { showHelp }
