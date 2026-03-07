function showHelp(): void {
  console.log(`
    Использование:
   npm run dev:cli -- add "описание"
    npm run dev:cli -- list
    npm run dev:cli -- list all
    npm run dev:cli -- list todo
    npm run dev:cli -- list done
    npm run dev:cli -- done <id>
    npm run dev:cli -- delete <id>
        `)
}

export { showHelp }
