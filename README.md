## Enlace al Trello del proyecto
https://trello.com/b/wQIvHjjI/checkpoint-→-nextjs
```
checkpoint-next
 ┣ .next
 ┣ node_modules
 ┣ public
 ┃ ┣ checkpointlogo.svg
 ┃ ┣ file.svg
 ┃ ┣ globe.svg
 ┃ ┣ next.svg
 ┃ ┣ placeholder.jpg
 ┃ ┣ vercel.svg
 ┃ ┗ window.svg
 ┣ src
 ┃ ┣ actions
 ┃ ┃ ┣ contact.actions.ts
 ┃ ┃ ┗ library.actions.ts
 ┃ ┣ api
 ┃ ┃ ┣ client.ts
 ┃ ┃ ┣ games.ts
 ┃ ┃ ┗ library.ts
 ┃ ┣ app
 ┃ ┃ ┣ api
 ┃ ┃ ┃ ┣ games
 ┃ ┃ ┃ ┃ ┣ search
 ┃ ┃ ┃ ┃ ┃ ┗ route.ts
 ┃ ┃ ┃ ┃ ┗ [id]
 ┃ ┃ ┃ ┃ ┃ ┗ route.ts
 ┃ ┃ ┃ ┗ library
 ┃ ┃ ┃ ┃ ┣ [id]
 ┃ ┃ ┃ ┃ ┃ ┗ route.ts
 ┃ ┃ ┃ ┃ ┗ route.ts
 ┃ ┃ ┣ game
 ┃ ┃ ┃ ┗ [id]
 ┃ ┃ ┃ ┃ ┣ loading.tsx
 ┃ ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ library
 ┃ ┃ ┃ ┣ add
 ┃ ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┃ ┣ loading.tsx
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ search
 ┃ ┃ ┃ ┣ loading.tsx
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ wishlist
 ┃ ┃ ┃ ┣ loading.tsx
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ favicon.ico
 ┃ ┃ ┣ globals.css
 ┃ ┃ ┣ layout.tsx
 ┃ ┃ ┣ loading.tsx
 ┃ ┃ ┗ page.tsx
 ┃ ┣ components
 ┃ ┃ ┣ game
 ┃ ┃ ┃ ┣ AddGameFromRawgModal.tsx
 ┃ ┃ ┃ ┣ EditableInfoRow.tsx
 ┃ ┃ ┃ ┣ GameCard.tsx
 ┃ ┃ ┃ ┣ GameCoverColumn.tsx
 ┃ ┃ ┃ ┣ GameDetailClient.tsx
 ┃ ┃ ┃ ┣ GameDetailHeader.tsx
 ┃ ┃ ┃ ┣ GameInfoColumn.tsx
 ┃ ┃ ┃ ┣ GameMetadataSection.tsx
 ┃ ┃ ┃ ┣ GameNotes.tsx
 ┃ ┃ ┃ ┣ KanbanBoard.tsx
 ┃ ┃ ┃ ┣ KanbanColumn.tsx
 ┃ ┃ ┃ ┣ KanbanItem.tsx
 ┃ ┃ ┃ ┣ RawgPreviewModal.tsx
 ┃ ┃ ┃ ┗ StarRating.tsx
 ┃ ┃ ┣ home
 ┃ ┃ ┃ ┣ HomeColumn.tsx
 ┃ ┃ ┃ ┣ HomeGameItem.tsx
 ┃ ┃ ┃ ┗ HomeStats.tsx
 ┃ ┃ ┣ layout
 ┃ ┃ ┃ ┣ Footer.tsx
 ┃ ┃ ┃ ┗ Navbar.tsx
 ┃ ┃ ┣ ui
 ┃ ┃ ┃ ┣ ActionMenu
 ┃ ┃ ┃ ┃ ┣ ActionMenu.tsx
 ┃ ┃ ┃ ┃ ┣ ActionMenuButton.tsx
 ┃ ┃ ┃ ┃ ┣ ActionMenuContext.tsx
 ┃ ┃ ┃ ┃ ┣ ActionMenuItem.tsx
 ┃ ┃ ┃ ┃ ┣ ActionMenuOverlay.tsx
 ┃ ┃ ┃ ┃ ┗ ActionMenuSearch.tsx
 ┃ ┃ ┃ ┣ Badge.tsx
 ┃ ┃ ┃ ┣ Button.tsx
 ┃ ┃ ┃ ┣ EmptyState.tsx
 ┃ ┃ ┃ ┣ ErrorMessage.tsx
 ┃ ┃ ┃ ┣ Icons.tsx
 ┃ ┃ ┃ ┣ Modal.tsx
 ┃ ┃ ┃ ┣ SearchInput.tsx
 ┃ ┃ ┃ ┣ Spinner.tsx
 ┃ ┃ ┃ ┗ TagInput.tsx
 ┃ ┃ ┗ Providers.tsx
 ┃ ┣ context
 ┃ ┃ ┣ LibraryContext.tsx
 ┃ ┃ ┗ ThemeContext.tsx
 ┃ ┣ data
 ┃ ┃ ┗ library.json
 ┃ ┣ hooks
 ┃ ┃ ┣ useFilters.ts
 ┃ ┃ ┣ useGameDetail.ts
 ┃ ┃ ┣ useLibrary.ts
 ┃ ┃ ┗ useTheme.tsx
 ┃ ┣ lib
 ┃ ┃ ┣ library.ts
 ┃ ┃ ┣ rawg.ts
 ┃ ┃ ┗ utils.ts
 ┃ ┣ types
 ┃ ┃ ┣ game.ts
 ┃ ┃ ┗ rawg.ts
 ┃ ┗ utils
 ┃ ┃ ┣ constants.ts
 ┃ ┃ ┣ formatters.ts
 ┃ ┃ ┗ rawgConstants.ts
 ┣ .env.local
 ┣ .gitignore
 ┣ components.json
 ┣ eslint.config.mjs
 ┣ next-env.d.ts
 ┣ next.config.ts
 ┣ package-lock.json
 ┣ package.json
 ┣ postcss.config.mjs
 ┣ README.md
 ┣ tsconfig.json
 ┗ tsconfig.tsbuildinfo
 ```
