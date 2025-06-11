## Fungsitama Nextjs

### Folder Structure

- actions: folder untuk business logic
- app: folder presentation view (equals dengan pages)
- components: react component
- drizzle: schema migration dan terdapat entity didalamnya (schema)
- dtos: interface untuk request (setiap data dari form yang masuk ke dalam database)
- entity: interface untuk membuat model (persis seperti di column yang ada di database)
- public: folder asset
- repositories: folder untuk menyimpan query server component
- services: folder untuk menjembatani action dengan presentation view pages(app) gunakan hooks di sini karena services termasuk client component
- lib: shared function yg dapat digunakan ulang
- app/api: folder untuk meresponse json (API) bukan view page html
- atoms: state management folder
- datasource/internal: digunakan untuk menyimpan data yang sifatnya dapat dipakai kembali, contoh: generate column, generate form field
- datasource/external: digunakan untuk menyimpan data yang resourcenya dari external
-

### How to use

1. pnpm i
2. set database_url di .env
3. pnpm dev
