This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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