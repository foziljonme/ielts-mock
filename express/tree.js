const fs = require("fs");
const path = require("path");

const EXCLUDED = new Set(["node_modules", ".git", "dist", "build", "prisma"]);

function printTree(dir, prefix = "") {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !EXCLUDED.has(entry.name))
    .sort((a, b) => {
      // Folders first, then files
      if (a.isDirectory() !== b.isDirectory()) {
        return a.isDirectory() ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const branch = isLast ? "└── " : "├── ";

    console.log(`${prefix}${branch}${entry.name}`);

    if (entry.isDirectory()) {
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      printTree(path.join(dir, entry.name), nextPrefix);
    }
  });
}

const root = process.argv[2] || process.cwd();

console.log(path.basename(path.resolve(root)));
printTree(root);
