``SETUP TYPESCRIPT``
-- 1. Create a Project
-- 2. Npm init -y
3. npm i --save-dev typescript
4. npm i --save-dev ts-node
5. npm install --save-dev @types/node

`` Project Setup``
6. npm i express
7. npm i --save-dev @types/express
8. npm i mongoose
9. npm i dotenv
10. npm i cors
11. create tsconfig.json file in root and pest this code 
  { 
    "compilerOptions": {
        "target": "es2020",
        "module": "commonjs",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "outDir": "./dist"
    },
    "include": ["src"],
    "exclude": ["node_modules"]
}