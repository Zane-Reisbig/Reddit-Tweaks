if (!(Test-Path -Path './dist')) {
	New-Item -ItemType Directory -Path './dist' | Out-Null
}
Remove-Item ./dist/reddit.js -ErrorAction SilentlyContinue
Remove-Item ./dist/reddit.js.map -ErrorAction SilentlyContinue

# Bundle with esbuild into a single file for the web. Requires Node.js.
# You can install esbuild locally: `npm install --save-dev esbuild`
# Or run via npx which will fetch it if not installed.
npx esbuild src/reddit.ts --bundle --outfile=./dist/reddit.js --sourcemap --format=iife --target=es2024