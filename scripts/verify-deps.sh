#!/usr/bin/env bash
set -uo pipefail

want="$(cat .node-version)"
have="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$have" != "$want" ]; then
	echo "Node $have is active but CI uses Node $want. Run: fnm exec -- $0 $*" >&2
	exit 2
fi

label="${1:-current}"
out=".verify/$label"
rm -rf "$out" && mkdir -p "$out"

export CI=true PUBLIC_ENV=ci
export PUBLIC_SUPABASE_URL=https://public-supabase-url.com
export PUBLIC_SUPABASE_ANON_KEY=some-public-supabase-anon-key
export SUPABASE_SERVICE_KEY=some-public-supabase-anon-key
export OPENAI_API_KEY=some-openai-api-key FAL_KEY=some-fal-ai-key
export PUBLIC_SENTRY_DNS=https://examplePublicKey@o0.ingest.sentry.io/0

status=0
run() {
	local name="$1"
	shift
	if "$@" >"$out/$name.log" 2>&1; then
		echo "PASS $name"
	else
		echo "FAIL $name (see $out/$name.log)"
		status=1
	fi
}

run install pnpm install --frozen-lockfile
run sync pnpm svelte-kit sync
run lint pnpm run lint
run check pnpm check
run unit pnpm vitest run
run build pnpm run build

smoke() {
	pnpm exec vite preview --port 4179 --strictPort >"$out/preview.log" 2>&1 &
	preview_pid=$!
	trap 'kill $preview_pid 2>/dev/null; wait $preview_pid 2>/dev/null' RETURN
	for _ in $(seq 30); do curl -s -o /dev/null http://localhost:4179/ && break; sleep 1; done
	local ok=0
	for path in / /auth/login /games; do
		local code
		code=$(curl -s -o "$out/page$(echo "$path" | tr / _).html" -w '%{http_code}' "http://localhost:4179$path")
		echo "$path $code"
		case "$path:$code" in /games:303 | /:200 | /auth/login:200) ;; *) ok=1 ;; esac
	done
	return $ok
}
run smoke smoke
run no-public-sourcemaps bash -c '! find .vercel/output/static -name "*.map" | grep .'

if [ -d .vercel/output/static ]; then
	(
		cd .vercel/output/static
		find . -type f -not -path './_app/immutable/*' | sort
		find ./_app/immutable -type f | sed -E 's|/[^/]*\.([a-z0-9]+)$| *.\1|' | sort | uniq -c
	) >"$out/static-files.txt"
	find .vercel/output/static -name '*.css' -exec shasum {} + | cut -d' ' -f1 | sort >"$out/css-sha.txt"
	find .vercel/output/static -type f -exec wc -c {} + | awk '$2 != "total" { n = split($2, p, "."); b[p[n]] += $1 } END { for (e in b) print e, b[e] }' | sort >"$out/bytes-by-ext.txt"
	du -sk .vercel/output/static | cut -f1 >"$out/static-kb.txt"
	echo "static output: $(cat "$out/static-kb.txt") KB, $(find .vercel/output/static -type f | wc -l | tr -d ' ') files"
fi

exit $status
