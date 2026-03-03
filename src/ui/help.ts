function showHelp(): void {
  console.log(`
    Использование:
    npm run dev -- add "описание"
    npm run dev -- list
    npm run dev -- done <id>
    npm run dev -- delete <id>
        `)
}

export { showHelp }
