//https://github.com/phiresky/sql.js-httpvfs

import { createDbWorker } from "sql.js-httpvfs";

// sadly there's no good way to package workers and wasm directly so you need a way to get these two URLs from your bundler.
// This is the webpack5 way to create a asset bundle of the worker and wasm:
const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);
// the legacy webpack4 way is something like `import wasmUrl from "file-loader!sql.js-httpvfs/dist/sql-wasm.wasm"`.

// the config is either the url to the create_db script, or a inline configuration:
// you can also pass multiple config objects which can then be used as separate database schemas
//with `ATTACH virtualFilename as schemaname`, where virtualFilename is also set in the config object.
async function load() {
  const worker = await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: "/example.sqlite3",
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

  // worker.db is a now SQL.js instance except that all functions return Promises.
  // we can also use: worker.db.exec
  const result = await worker.db.query(`select * from mytable`);

  document.body.textContent = JSON.stringify(result);
}

load();